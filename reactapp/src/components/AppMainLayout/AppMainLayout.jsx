import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';

import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import './AppMainLayout.css'
import RankingUI from '../RankingUI/RankingUI';
import ChoiceHistoryUI from '../ChoiceHistoryUI/ChoiceHistoryUI';
import SelectDatasetUI from '../SelectDatasetUI/SelectDatasetUI';
import RankPredictionsUI from '../RankPredictionsUI/RankPredictionsUI';

const drawerWidth = 240;

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

export function PersistentDrawerLeft() {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <Drawer
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                },
            }}
            variant="persistent"
            anchor="left"
            open={open}
        >
            <DrawerHeader>
                <IconButton onClick={handleDrawerClose}>
                    {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </IconButton>
            </DrawerHeader>
            <Divider />
            <List>
                {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                {['All mail', 'Trash', 'Spam'].map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Drawer>
    );
}

export default function VerticalTabs({ appInst }) {
    const [value, setValue] = React.useState(0);


    const handleChange = (event, newValue) => {
        setValue(newValue);
    };


    const handleChangeIndex = (index) => {
        setValue(index);
    };

    const onSelectNewDataset = () => {
        setValue(0)
    }

    return (
        <div className = 'appMainLayout'>
            <h2 style={{ color: '#a1a1a1' }} >Current Dataset: {appInst.state.activeDatasetName}</h2>
        <Box
                sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: '-webkit-fill-available' }}
            >
                <Tabs
                id='appMainLayout-tabs'
                orientation="vertical"
                value={value}
                onChange={handleChange}
                aria-label="Vertical tabs example"
                sx={{ borderRight: 1, borderColor: 'divider' }}
                centered
            >
                <Tab label="Make Choices" {...a11yProps(0)} />
                <Tab label="Rank Predictions" {...a11yProps(1)} />
                <Tab label="Choice History" {...a11yProps(2)} />
                <Tab label="Tools" {...a11yProps(3)} />
                <Tab label="Switch Dataset" {...a11yProps(3)} />
            </Tabs>

            <TabPanel value={value} index={0}>
                <RankingUI appInst={appInst} />
            </TabPanel>
                <TabPanel value={value} index={1}>
                    <RankPredictionsUI appInst={appInst} />
            </TabPanel>
                <TabPanel value={value} index={2}>
                    <ChoiceHistoryUI appInst={appInst} />
            </TabPanel>
            <TabPanel value={value} index={3}>
                Tools
            </TabPanel>
                <TabPanel value={value} index={4}>
                    <SelectDatasetUI appInst={appInst} onSelectNewDataset={onSelectNewDataset} />
            </TabPanel>
            <TabPanel value={value} index={5}>
                Item Six
            </TabPanel>
            <TabPanel value={value} index={6}>
                Item Seven
                </TabPanel>
            </Box>
        </div>
    );
}

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`vertical-tabpanel-${index}`}
                aria-labelledby={`vertical-tab-${index}`}
                {...other}
            >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography component='div'>{children}</Typography>
                </Box>
            )}
            </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

VerticalTabs.propTypes = {
    appInst: PropTypes.object
}