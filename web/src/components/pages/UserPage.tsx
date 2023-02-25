import { useParams } from 'react-router-dom';
import UserDetails from 'components/UserDetails';
import Page from 'components/Page';

const UserPage = () => {
  const { address } = useParams();

  return (
    <Page>
      {address && <UserDetails address={address} tabName='sources' />}
    </Page>
  );
};

export default UserPage;
