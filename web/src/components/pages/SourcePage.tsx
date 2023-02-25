import Page from 'components/Page';
import Alert from '@mui/material/Alert';
import SourceDetails from 'components/SourceDetails';
import { useParams } from 'react-router-dom';

const SourcePage = () => {
  const { ownerAddress, sourceId } = useParams();

  return (
    <Page>
      {ownerAddress && sourceId ? (
        <SourceDetails ownerAddress={ownerAddress} sourceId={sourceId} />
      ) : (
        <Alert severity='info'>Source not found</Alert>
      )}
    </Page>
  );
};

export default SourcePage;
