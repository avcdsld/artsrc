import { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Address from './Address';
import UserSources from './UserSources';

interface Props {
  address: string;
  tabName: string;
}

function a11yProps(index: number) {
  return {
    id: `user-tab-${index}`,
    'aria-controls': `user-tabpanel-${index}`,
  };
}

const UserDetails = ({ address, tabName }: Props) => {
  const [tab, setTab] = useState(0);

  return (
    <Box>
      <Stack
        direction='row'
        spacing={2}
        // justifyContent='center'
        alignItems='center'
        marginBottom={4}
      >
        <Card>
          <img
            src={`/img/avatar/${1}.png`} // TODO: change by address
            alt={address}
            width={120}
            height={120}
          />
        </Card>
        <Box>
          <Address address={address} both={true} />
        </Box>
      </Stack>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={tab}
          onChange={(_event: React.SyntheticEvent, newValue: number) => {
            setTab(newValue);
          }}
          aria-label='tabs'
        >
          <Tab
            label='Sources'
            {...a11yProps(0)}
            component={Link}
            href={`/user/${address}`}
          />
          <Tab
            label='Collections'
            {...a11yProps(1)}
            component={Link}
            href={`/user/${address}/collections`}
          />
        </Tabs>
      </Box>

      <Box sx={{ marginTop: 4 }} />

      {tab === 0 ? (
        <UserSources address={address} />
      ) : (
        <div style={{ margin: 12 }}> *Under development</div>
      )}
    </Box>
  );
};

export default UserDetails;
