import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import useTheme from '@mui/material/styles/useTheme';
import { Project } from 'utils/types';
import TokenPreview from 'components/TokenPreview';
import { useWindowSize } from 'hooks/useWindowSize';
import SourceStats from './SourceStats';
import Collapsible from './Collapsible';

interface Props {
  project: Project;
}

const random = Math.random();

const ProjectOverview = ({ project }: Props) => {
  const randomIndex = Math.floor(random * project?.tokens?.length);
  const token = project?.tokens[randomIndex];
  const theme = useTheme();
  const size = useWindowSize();

  const width =
    size.width > theme.breakpoints.values.md
      ? (Math.min(size.width, 1200) - 48) * 0.666666
      : size.width > theme.breakpoints.values.sm
      ? size.width - 48
      : size.width - 32;

  let scriptJSON;
  try {
    scriptJSON = JSON.parse(project.scriptJSON);
  } catch (e) {
    console.log('Error parsing script JSON');
  }

  if (!project) {
    return null;
  }

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item md={8}>
          <TokenPreview
            id={token.id}
            tokenId={token.tokenId}
            invocation={token.invocation}
            aspectRatio={scriptJSON?.aspectRatio}
            width={width}
          />
        </Grid>
        <Grid item md={4}>
          <Box sx={{ paddingLeft: [0, 0, 2] }}>
            <SourceStats
              complete={project.complete}
              paused={project.paused}
              startTime={project.minterConfiguration?.startTime}
            />

            <Link
              href={`/project/${project.projectId}`}
              sx={{ display: 'block', marginTop: 3 }}
              underline='hover'
            >
              <Typography variant='h4'>{project.name}</Typography>
            </Link>
            <Typography variant='h6'>{project.artistName}</Typography>
            <Collapsible content={project.description} />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProjectOverview;
