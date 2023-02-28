import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ImageIcon from '@mui/icons-material/Image';
import CenteredTabs from './CenteredTabs';
import Address from './Address';
import AceEditor from 'react-ace';
import 'ace-builds/webpack-resolver';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-github';
import useSource from 'hooks/useSource';
import Alert from '@mui/material/Alert';
import Loading from './Loading';

interface Props {
  ownerAddress: string;
  sourceId: string;
  height?: number | string;
  showLiveViewLink?: boolean;
  showImageLink?: boolean;
}

const SourcePreview = ({
  ownerAddress,
  sourceId,
  showLiveViewLink,
  showImageLink,
}: Props) => {
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

  return (
    <Box>
      <CenteredTabs labels={['Image', 'Code']}>
        <Box>
          {data && (
            <Card>
              <img
                src={`https://nftstorage.link/ipfs/${data.imageIpfsCid}`}
                alt={sourceId}
                style={{ marginBottom: '-7px', maxWidth: '100%' }}
              />
            </Card>
          )}
        </Box>
        <Box sx={{ border: 1, borderColor: 'grey.400' }}>
          <AceEditor
            mode='javascript'
            theme='github'
            value={data.code}
            // readOnly
            name='code'
            width='100%'
            highlightActiveLine={false}
            wrapEnabled
            fontSize={13}
            maxLines={28}
            setOptions={{
              showLineNumbers: true,
              useWorker: false,
              fontFamily: "'DM Mono', monospace",
            }}
          />
        </Box>
      </CenteredTabs>

      <Box
        sx={{
          marginTop: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box>
          {/* {invocation && (
            <Box display={['none', 'none', 'block']}>
              <Link href={`token/${id}`} sx={{ fontSize: '.8em' }}>
                Showing mint #{invocation.toString()}
              </Link>
            </Box>
          )} */}
          {ownerAddress && (
            <>
              Owned by <Address address={ownerAddress} forDetailPage={true} />
            </>
          )}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {showLiveViewLink && (
            <Button
              startIcon={<VisibilityIcon sx={{ color: '#666' }} />}
              sx={{
                fontSize: 14,
                textTransform: 'none',
                minWidth: [0, 0, '64px'],
                padding: [0, 0, 'default'],
              }}
              component={Link}
              href={`/source/${sourceId}`}
            >
              <Typography fontSize='14px' display={['none', 'none', 'block']}>
                Live view
              </Typography>
            </Button>
          )}
          {showImageLink && data && (
            <Button
              startIcon={<ImageIcon sx={{ color: '#666' }} />}
              sx={{
                fontSize: 14,
                textTransform: 'none',
                marginLeft: [1, 1, 2],
                minWidth: [0, 0, '64px'],
                padding: [0, 0, 'default'],
              }}
              onClick={() => {
                window.open(
                  `https://nftstorage.link/ipfs/${data.imageIpfsCid}`
                );
              }}
            >
              <Typography fontSize='14px' display={['none', 'none', 'block']}>
                Image
              </Typography>
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default SourcePreview;
