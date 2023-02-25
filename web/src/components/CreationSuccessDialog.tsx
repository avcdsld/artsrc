import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import SourcePreview from './SourcePreview';

interface Props {
  open: boolean;
  handleClose: () => void;
  ownerAddress: string | null;
  sourceId: string | null;
  editMode?: boolean | null;
}

const CreationSuccessDialog = ({
  open,
  handleClose,
  ownerAddress,
  sourceId,
  editMode,
}: Props) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          m: 0,
          position: 'fixed',
          top: 140,
          alignItems: 'center',
        },
      }}
      fullWidth
    >
      <Alert severity='success' sx={{ width: '100%' }}>
        {!editMode ? 'Creation successful!' : 'Updating successful!'}
      </Alert>

      {ownerAddress && sourceId && (
        <Box
          width={480}
          alignContent={'center'}
          alignItems={'center'}
          textAlign={'center'}
        >
          <SourcePreview ownerAddress={ownerAddress} sourceId={sourceId} />
        </Box>
      )}

      <DialogActions sx={{ justifyContent: 'center' }}>
        <Button color='secondary' sx={{ marginRight: 1 }} onClick={handleClose}>
          Close
        </Button>
        <Button
          href={`/source/${ownerAddress?.toLowerCase()}/${sourceId}`}
          color='primary'
        >
          View details
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreationSuccessDialog;
