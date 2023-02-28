import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import useSource from 'hooks/useSource';
import SourcePreview from './SourcePreview';
import SourceStats from './SourceStats';
import Loading from './Loading';
import PurchaseSource from './PurchaseSource';
import Collapsible from './Collapsible';
import Address from './Address';
import moment from 'moment';

interface Props {
  ownerAddress: string;
  sourceId: string;
}

interface TitleProps {
  children: any;
}

const Title = ({ children }: TitleProps) => (
  <Typography fontSize='12px' textTransform='uppercase' mb={2}>
    {children}
  </Typography>
);

const SourceDetails = ({ ownerAddress, sourceId }: Props) => {
  const { loading, error, data } = useSource({ ownerAddress, sourceId });

  if (data === null) {
    return <Alert severity='error'>Source not found</Alert>;
  }

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Alert severity='error'>Error loading project</Alert>;
  }

  const source = data;
  const {
    artType,
    createdAt,
    description,
    artistName,
    title,
    code,
    updatedAt,
    version,
  } = source;

  const getContractName = (str) => {
    if (!str) {
      return '';
    }
    const regexResult = str.match(/pub\s+contract\s+(.+?)\s*?[:{]/);
    if (!regexResult) {
      return '';
    }
    return regexResult.length >= 1 ? regexResult[1] : '';
  };

  return (
    source && (
      <Box>
        <Breadcrumbs aria-label='breadcrumb' sx={{ marginBottom: 4 }}>
          <Link href='/' underline='hover' sx={{ color: '#666' }}>
            art / src
          </Link>
          <Address address={ownerAddress} forDetailPage={true} color={'#666'} />
          <Typography>{title}</Typography>
        </Breadcrumbs>

        <Grid spacing={2} container>
          <Grid item md={6} xs={12} sm={12}>
            <SourcePreview ownerAddress={ownerAddress} sourceId={sourceId} />
          </Grid>

          <Grid item md={6} xs={12} sm={12}>
            <Box sx={{ width: '100%', paddingLeft: [0, 0, 2] }}>
              <SourceStats
                paused={false}
                complete={false}
                startTime={createdAt}
              />

              <Typography variant='h4' mt={3}>
                {title}
              </Typography>

              <Typography variant='h6' mb={2}>
                {artistName}
              </Typography>

              <Divider
                sx={{ display: ['none', 'block', 'none'], marginBottom: 2 }}
              />

              {/* <Box sx={{ fontWeight: 'bold', marginBottom: 3 }}>
                1 collected
              </Box> */}

              {/* <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 3,
                }}
              >
                <LinearProgress
                  sx={{ width: 'calc(100% - 48px)' }}
                  value={(invocations / maxInvocations) * 100}
                  variant='determinate'
                />
                <Box sx={{ fontSize: 12 }}>
                  {Math.floor((invocations / maxInvocations) * 100)} %
                </Box>
                <Box sx={{ fontSize: 12 }}>{Math.floor(1)} %</Box>
              </Box> */}

              {artType === 'cadence' && (
                <Box
                  sx={{
                    display: 'flex',
                    marginBottom: 3,
                  }}
                >
                  <Button
                    variant='contained'
                    color='primary'
                    target={'_blank'}
                    href={`https://testnet.flowscan.org/contract/A.${ownerAddress
                      ?.toLowerCase()
                      .replace('0x', '')}.${getContractName(code)}`}
                  >
                    <span>VIEW</span>
                    <span style={{ marginLeft: 14 }}>CONTRACT</span>
                  </Button>
                </Box>
              )}
              {artType === 'p5js' && (
                <Box
                  sx={{
                    display: 'flex',
                    marginBottom: 3,
                  }}
                >
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={() => {}}
                    href={`/source/${ownerAddress?.toLowerCase()}/${sourceId}/edit`}
                  >
                    <span>RUN</span>
                    <span style={{ marginLeft: 14 }}>CODE</span>
                  </Button>
                </Box>
              )}

              <PurchaseSource source={source} />
            </Box>
          </Grid>
        </Grid>

        <Grid spacing={2} container mt={4} pb={4}>
          <Grid item md={7} sm={12} xs={12}>
            <Typography variant='h6' mb={2}>
              About {title}
            </Typography>

            <Box paddingRight={[0, 0, 4]}>
              <Collapsible content={description} />
            </Box>

            <Box sx={{ display: 'flex', marginTop: 4 }}>
              <Box mr={6}>
                <Title>Art Type</Title>
                <Typography>{artType}</Typography>
              </Box>
              <Box mr={6}>
                <Title>Version</Title>
                <Typography>{version}</Typography>
              </Box>
              <Box mr={6}>
                <Title>Last Updated</Title>
                <Typography>
                  {updatedAt &&
                    moment.unix(parseInt(updatedAt)).format('MMM DD, YYYY')}
                </Typography>
              </Box>
              <Box mr={6}>
                <Title>Artist</Title>
                <Typography>{artistName}</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    )
  );
};

export default SourceDetails;
