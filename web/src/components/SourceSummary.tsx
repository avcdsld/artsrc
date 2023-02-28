import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Source } from 'utils/types';
import InstanceImage from 'components/InstanceImage';
import Link from '@mui/material/Link';
import Collapsible from './Collapsible';
import SourceStats from './SourceStats';

interface Props {
  source: Source;
  width?: number;
  showDescription?: boolean;
}

const SourceSummary = ({
  source,
  width = 280,
  showDescription = false,
}: Props) => {
  if (!source) {
    return null;
  }

  return (
    <Box sx={{ paddingBottom: 8 }}>
      <InstanceImage
        instanceId={'1'} // TODO:
        sourceId={source.sourceId}
        imageIpfsCid={source.imageIpfsCid}
        width={width}
        invocation={undefined}
      />
      <Box mt={3}>
        <SourceStats
          complete={false}
          paused={false}
          startTime={source.createdAt}
        />
      </Box>
      <Box mt={2}>
        <Link
          href={`/source/${source.ownerAddress}/${source.sourceId}`}
          underline='hover'
          sx={{ marginTop: 1, fontSize: 32 }}
        >
          {source.title}
        </Link>
        <Typography variant='h6' mb={2}>
          {source.artistName}
        </Typography>
        {showDescription && <Collapsible content={source.description} />}
      </Box>
    </Box>
  );
};

export default SourceSummary;
