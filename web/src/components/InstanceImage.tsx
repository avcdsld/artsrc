import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';

interface Props {
  instanceId: string;
  sourceId: string;
  imageIpfsCid: string;
  width: number;
  hd?: boolean;
  thumb?: boolean;
  aspectRatio?: number;
  invocation?: BigInt;
}

const InstanceImage = ({
  instanceId,
  sourceId,
  imageIpfsCid,
  hd = false,
  thumb = false,
  width,
  invocation,
}: Props) => {
  return (
    <Box>
      <Card>
        <img
          src={`https://nftstorage.link/ipfs/${imageIpfsCid}`}
          alt={instanceId}
          width={width}
          // height={height}
          style={{ marginBottom: '-7px' }}
        />
      </Card>
      {invocation !== undefined && (
        <Box
          sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}
        >
          <Link
            href={`/source/${sourceId}/${instanceId}`}
            sx={{ fontSize: '14px', marginTop: 1 }}
          >
            Mint #{invocation?.toString()}
          </Link>
        </Box>
      )}
    </Box>
  );
};

export default InstanceImage;
