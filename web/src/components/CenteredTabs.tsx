import { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

const TabPanel = (props: any) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`centered-tabs-tabpanel-${index}`}
      aria-labelledby={`centered-tabs-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
};

const CenteredTabs = (props: any) => {
  const [value, setValue] = useState(0);

  const handleChange = (_event: any, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: 2 }}>
        <Tabs
          value={value}
          onChange={handleChange}
          centered
          variant='fullWidth'
        >
          {props.labels.map((label: string, index: number) => (
            <Tab label={label} key={'tab-' + index}></Tab>
          ))}
        </Tabs>
      </Box>
      {props.children.map((child: any, index: number) => (
        <TabPanel value={value} index={index} key={'tab-panel-' + index}>
          {child}
        </TabPanel>
      ))}
    </div>
  );
};

export default CenteredTabs;
