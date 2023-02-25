import { useParams } from 'react-router-dom';
import UserDetails from 'components/UserDetails';
import Page from 'components/Page';

const UserCollectionsPage = () => {
  const { address } = useParams();

  return (
    <Page>
      {address && <UserDetails address={address} tabName='collections' />}
    </Page>
  );
};

export default UserCollectionsPage;
