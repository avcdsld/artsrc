import Page from 'components/Page';
import { useParams } from 'react-router-dom';
import Create from 'components/Create';

const EditPage = () => {
  const { ownerAddress, sourceId } = useParams();

  return (
    <Page>
      <Create editMode={true} ownerAddress={ownerAddress} sourceId={sourceId} />
    </Page>
  );
};

export default EditPage;
