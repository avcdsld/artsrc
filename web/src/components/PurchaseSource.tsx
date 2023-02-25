import { useState } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { Source } from 'utils/types';
import MintSuccessDialog from './MintSuccessDialog';

interface Props {
  source: Source;
}

const PurchaseSource = ({ source }: Props) => {
  const [pending] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [mintedTokenId] = useState<number | null>(null);

  const mint = () => {
    // if (!provider || !mintContractAddress) {
    //   return;
    // }
    // notifyTx({
    //   method: mintAction,
    //   chainId: expectedChainId,
    //   success: 'Your token has been minted!',
    //   error: 'An error occured while trying to mint.',
    //   onSuccess: (receipt:any) => {
    //     const tokenId = parseInt(receipt?.events[0]?.topics[3], 16);
    //     setMintedTokenId(tokenId);
    //     setPending(false);
    //     setSuccessOpen(true);
    //   },
    //   onSubmitted: () => setPending(true),
    //   onError: () => setPending(false),
    // });
  };

  if (!source) {
    return null;
  }

  // if (source.paused) {
  //   return (
  //     <Button variant='contained' color='primary' disabled>
  //       Purchases paused
  //     </Button>
  //   );
  // }

  // if (startTime && startTime.isAfter()) {
  //   return <Alert severity='info'>Upcoming</Alert>;
  // }

  // if (!source.active) {
  //   return <Alert severity='info'>source is not active</Alert>;
  // }

  // if (!source.active) {
  //   return <Alert severity='info'>source is not active</Alert>;
  // }

  // if (source.complete) {
  //   return <Alert severity='info'>Sold out</Alert>;
  // }

  // if (!isActive) {
  //   return (
  //     <Button variant='contained' color='primary' onClick={connect}>
  //       Connect to purchase
  //     </Button>
  //   );
  // }

  // if (chainId !== expectedChainId) {
  //   return (
  //     <Alert severity='warning'>
  //       Switch to {CHAINS[expectedChainId]?.name} to purchase
  //     </Alert>
  //   );
  // }

  // let customToken: ERC20Token;
  // if (usesCustomToken) {
  //   customToken = {
  //     address: source.currencyAddress,
  //     decimals: 18,
  //     symbol: source.currencySymbol,
  //   };
  // }

  return (
    <>
      {pending ? (
        <LoadingButton loading variant='outlined' color='primary'>
          Purchasing
        </LoadingButton>
      ) : (
        <>
          <Button
            variant='contained'
            color='primary'
            onClick={mint}
            disabled={true}
          >
            <span>Create</span>
            <span style={{ marginLeft: 14 }}>Instance</span>
          </Button>
          <Box sx={{ marginLeft: 1 }}>*Under development</Box>
        </>
      )}
      <MintSuccessDialog
        mintedTokenId={String(mintedTokenId)}
        open={successOpen}
        handleClose={() => {
          setSuccessOpen(false);
        }}
      />
    </>
  );
};

export default PurchaseSource;
