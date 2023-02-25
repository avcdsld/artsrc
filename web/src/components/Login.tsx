import { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import LogoutIcon from '@mui/icons-material/Logout';
import * as fcl from '@onflow/fcl';
import { useWallet } from 'hooks/useWallet';
import { bloctoConnector, walletDiscoveryConnector } from 'utils/connectors';
import WalletConnector from './WalletConnector';
import Address from './Address';

const navItems = [
  {
    label: 'CREATE A CODE',
    url: '/create',
  },
];

const Login = () => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const { isActive, account } = useWallet();

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setError(undefined);
  };

  const disconnect = () => {
    try {
      fcl.unauthenticate();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {isActive && account ? (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.url}
              sx={{ color: 'white', marginRight: 2 }}
            >
              {item.label}
            </Link>
          ))}

          <Address address={account.addr} />
          <IconButton
            onClick={disconnect}
            sx={{ marginLeft: 1, color: 'white' }}
          >
            <LogoutIcon />
          </IconButton>
        </Box>
      ) : (
        <Button variant='contained' onClick={handleOpen}>
          Login
        </Button>
      )}

      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            m: 0,
            position: 'fixed',
            top: 140,
          },
        }}
        fullWidth
      >
        <Box
          sx={{
            padding: 2,
          }}
        >
          <Typography pb={1} variant='h6'>
            Login
          </Typography>

          <Divider />

          <Box
            sx={{
              display: 'flex',
              marginTop: 3,
              margin: '8px auto',
              width: '100%',
              maxWidth: '550px',
              alignItems: 'center',
              flexDirection: ['column', 'row'],
            }}
          >
            <WalletConnector
              name='Blocto Wallet'
              logo='/img/blocto-logo.png'
              connector={bloctoConnector}
              onError={setError}
              onSuccess={handleClose}
            />
            <WalletConnector
              name='Other Wallet'
              logo='/img/wallet-logo.png'
              connector={walletDiscoveryConnector}
              onError={setError}
              onSuccess={handleClose}
            />
            <WalletConnector
              name='Google'
              logo='/img/google-logo.png'
              connector={walletDiscoveryConnector}
              onError={setError}
              onSuccess={handleClose}
            />
          </Box>

          {error && <Alert severity='error'>{error}</Alert>}
        </Box>
      </Dialog>
    </>
  );
};

export default Login;
