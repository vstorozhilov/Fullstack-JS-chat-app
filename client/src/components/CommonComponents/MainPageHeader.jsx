import React, { useContext } from 'react';
import { useTheme, Tab, Tabs, Grid, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { DensityMedium } from '@mui/icons-material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useSelector, useDispatch } from 'react-redux';
import { disconnectFromDatabase } from '../../databaseSubscriber';
import CircularProgress from '@mui/material/CircularProgress';
import { authentificationContext } from '../../Routes';

export default function MainPageHeader (props) {
  const theme = useTheme();
  const nickname = useSelector(state => state.userReducer.User.profile.nickname);
  const navigate = useNavigate();
  const { setUser } = useContext(authentificationContext);
  const dispatch = useDispatch();

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
        flexWrap='nowrap'
      >
        <Grid container width='fit-content'>
          <Grid
            item
            sx={{
              fontWeight: '600',
              marginTop: '20px',
              marginLeft: '5vw'
            }}
          >
            {nickname || <CircularProgress size='5vh' sx={{ color: '#ffffff' }} thickness={2.0} />}
          </Grid>
        </Grid>
        <Grid container width='fit-content' flexWrap='nowrap'>
          <Grid item>
            <IconButton onClick={() => {
              localStorage.removeItem('user');
              props.setReverseAnim(true);
              setUser({});
              disconnectFromDatabase();
              dispatch({ type: 'SET_IS_MAIN_PAGE_ONCE_RENDERED', value: false });
              navigate('/login');
            }}
            >
              <LogoutIcon
                sx={{
                  color: theme.palette.secondary.text,
                  transform: 'scaleX(-1)'
                }} fontSize='large'
              />
            </IconButton>
          </Grid>
          <Grid item>
            <IconButton>
              <DensityMedium
                sx={{
                  color: theme.palette.secondary.text
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
            width: '90%',
            '& .MuiTabs-indicator': {
              height: '0.65vh',
              backgroundColor: theme.palette.secondary.text,
              borderRadius: '1vh'
            },
            '& .MuiButtonBase-root': {
              textTransform: 'none',
              width: '33%'
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
