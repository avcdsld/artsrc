import Page from 'components/Page';
// import { useParams } from 'react-router-dom';
import Create from 'components/Create';

const CreatePage = () => {
  // const { id } = useParams();
  // const id = '0xa7d8d9ef8d8ce8992df33d8b8cf4aebabd5bd270-371';
  return (
    <Page>
      <Create />
    </Page>
  );
};

export default CreatePage;
