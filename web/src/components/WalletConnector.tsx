import { useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import { FlowWalletConnector } from 'utils/types';

interface Props {
  name: string;
  logo: string;
  width?: number | string;
  connector: FlowWalletConnector;
  onError: (error: string | undefined) => void;
  onSuccess: () => void;
}

const formatError = (error: any): string => {
  if (error && error.message) {
    return error.message;
  }
  return 'Unexpected error';
};

const WalletConnector = ({
  name,
  logo,
  width = 100,
  connector,
  onError,
  onSuccess,
}: Props) => {
  const connect = useCallback(async () => {
    onError(undefined);
    try {
      await connector.connect();
      onSuccess();
    } catch (error) {
      onError(formatError(error));
    }
  }, [connector, onError, onSuccess]);

  return (
    <ButtonBase disableRipple sx={{ cursor: 'pointer' }} onClick={connect}>
      <Box
        sx={{
          height: 170,
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'column',
          cursor: 'pointer',
          margin: 2,
          padding: 3,
          borderRadius: 3,
          border: '1px solid #eee',
        }}
      >
        <img src={logo} alt={name} width={width} style={{ marginBottom: 10 }} />
        <Typography pb={2} fontSize={14} fontWeight={400} textAlign='center'>
          {name}
        </Typography>
      </Box>
    </ButtonBase>
  );
};

export default WalletConnector;
