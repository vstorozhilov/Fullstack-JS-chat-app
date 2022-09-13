import React from 'react';
import { useTheme, Tab, Tabs, Grid, IconButton } from '@mui/material';
import { Search, DensityMedium } from '@mui/icons-material';
import { useSelector } from 'react-redux';

export default function MainPageHeader (props) {
  const theme = useTheme();
  const nickname = useSelector(state => state.userReducer.User.profile.nickname);

  const handleChange = (event, newValue) => {
    props.tabIndexer.setValue((prev) => { props.tabIndexer.setPrevValue(prev); return newValue; });
  };

  function a11yProps (index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`
    };
  }

  return (
    <header style={{
      background: 'linear-gradient(to right, #4f89ff, #2d71fd)',
      color: theme.palette.secondary.text
    }}
    >
      <Grid
        container
        width='100%'
        direction='row'
        justifyContent='space-between'
      >
        <Grid container width='fit-content'>
          <Grid
            item
            sx={{
              fontWeight: '600',
              fontSize: '2.5vh',
              marginTop: '2vh',
              marginLeft: '5vw'
            }}
          >
            {nickname}
          </Grid>
        </Grid>
        <Grid container width='fit-content'>
          <Grid item>
            <IconButton>
              <Search
                sx={{
                  color: theme.palette.secondary.text,
                  marginTop: '1vh'
                }} fontSize='large'
              />
            </IconButton>
          </Grid>
          <Grid item>
            <IconButton>
              <DensityMedium
                sx={{
                  color: theme.palette.secondary.text,
                  marginTop: '1vh'
                }} fontSize='large'
              />
            </IconButton>
          </Grid>
        </Grid>
      </Grid>
      <Grid
        container
        direction='row'
        justifyContent='center'
        width='100%'
      >
        <Tabs
          value={props.tabIndexer.value}
          onChange={handleChange}
          textColor='inherit'
          aria-label='basic tabs example'
          sx={{
            '& .MuiTabs-indicator': {
              height: '0.65vh',
              backgroundColor: theme.palette.secondary.text,
              borderRadius: '1vh'
            },
            '& .MuiButtonBase-root': {
              textTransform: 'none',
              width: '30vw',
              fontSize: '2vh'
            }
          }}
        >
          <Tab label='Chats' {...a11yProps(0)} />
          <Tab label='Contacts' {...a11yProps(1)} />
          <Tab label='Profile' {...a11yProps(2)} />
        </Tabs>
      </Grid>
    </header>
  );
}
