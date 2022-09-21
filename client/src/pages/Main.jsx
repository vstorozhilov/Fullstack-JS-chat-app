
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransition } from '@react-spring/web';
import { IconButton, useTheme, Grid } from '@mui/material';
import DialogsListItems from '../components/DialogsListTabComponents/DialogsListItems';
import ContactsListItems from '../components/ContactListTabComponents/ContactsListItems';
import { useSelector, useDispatch } from 'react-redux';
import Profile from '../components/ProfileTabComponents/Profile';
import { authentificationContext } from '../Routes';
import { connectToDatabase, mainPageWillMount, mainPageRefreshSubscribers } from '../databaseSubscriber';
import { BsFillChatDotsFill } from 'react-icons/bs';
import MainPageHeader from '../components/CommonComponents/MainPageHeader';
import StartNewDialog from '../components/DialogsListTabComponents/StartNewDialog';
import TabPanel from '../components/CommonComponents/TabPanel';

export default function Main (props) {
  const [isLoadingUpdates, setIsLoadingUpdates] = useState(false);
  const [isStartMessagingActive, setIsStartMessagingActive] = useState(false);
  const [value, setValue] = React.useState(0);
  const [prevValue, setPrevValue] = React.useState(-1);
  const theme = useTheme();
  const { user: { token } } = useContext(authentificationContext);
  const navigate = useNavigate();
  const isOnceRendered = useSelector(state => state.mainPageOnceRenderedReducer.isMainPageOnceRendered);
  const dispatch = useDispatch();

  function updateCredentials () {
    setIsLoadingUpdates(true);

    fetch('/api/main', {
      mode: 'cors',
      method: 'POST',
      headers: { Authorization: token },
      body: JSON.stringify({ action: 'updateAll' })
    }).then((response) => {
      if (response.status === 200) {
        response.json().then(([contacts, dialogs, user]) => {
          dispatch({ type: 'SET_CONTACTS', value: contacts });
          dispatch({ type: 'SET_DIALOGS', value: dialogs });
          dispatch({ type: 'SET_USER', value: user });
          setIsLoadingUpdates(false);
        });
      }
      if (response.status === 401) {
        localStorage.removeItem('user');
        navigate('/login');
      }
    });
  }

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
    if (isOnceRendered === false) {
      mainPageWillMount();
      dispatch({ type: 'SET_IS_MAIN_PAGE_ONCE_RENDERED' });
      connectToDatabase(token);
    }
    mainPageRefreshSubscribers();
    updateCredentials();
  }, []);

  const TabPages = [
    ({ styles, value }) => <TabPanel style={styles} value={value} index={0}><DialogsListItems isLoadingUpdates={isLoadingUpdates} /></TabPanel>,
    ({ styles, value, ...props }) => <TabPanel style={styles} value={value} index={1}><ContactsListItems isStartingNewDialogWindow={false} {...props} /></TabPanel>,
    ({ styles, value }) => <TabPanel style={styles} value={value} index={2}><Profile /></TabPanel>
  ];

  const transitions = useTransition(value,
    {
      from: prevValue < value ? { transform: 'translateX(100%)' } : { transform: 'translateX(-100%)' },
      enter: { transform: 'translateX(0%)' },
      leave: prevValue < value ? { transform: 'translateX(-100%)' } : { transform: 'translateX(100%)' }
    });

  const chatIconAnimationDown = 'animation-name : chatIconAnimationDown; animation-duration: 0.25s; color : #ffffff;';
  const chatIconAnimationUp = `animation-name : chatIconAnimationUp; animation-duration: 0.25s; color : ${theme.palette.primary.dark};`;
  const chatIconButtonAnimationDown = `animation-name : chatIconButtonAnimationDown; animation-duration: 0.25s; background-color : ${theme.palette.primary.dark};`;
  const chatIconButtonAnimationUp = 'animation-name : chatIconButtonAnimationUp; animation-duration: 0.25s; background-color : #ffffff;';

  return (token && isOnceRendered &&
    <Grid
      container
      justifyContent='center'
      height='100%'
      width='100%'
    >
      <Grid
        container
        direction='column'
        wrap='nowrap'
        height='100%'
        sx={{
          overflowY: 'hidden',
          [theme.breakpoints.up('tablet')]: {
            width: '600px'
          },
          [theme.breakpoints.down('tablet')]: {
            width: '100%'
          },
          position: 'relative',
          backgroundColor: 'rgb(255, 255, 255, 0.7)',
          overflowX: 'hidden'
        }}
      >
        {isStartMessagingActive
          ? <StartNewDialog
              isStartMessagingActive={isStartMessagingActive}
              setIsStartMessagingActive={setIsStartMessagingActive}
            />
          : null}
        <MainPageHeader tabIndexer={{ value, setValue, setPrevValue }} setReverseAnim={props.setReverseAnim} />
        <Grid
          item
          flexGrow='1'
          sx={{
            position: 'relative',
            width: '100%',
            overflowY: 'scroll'
          }}
        >
          {transitions((styles, item) => {
            const Page = TabPages[item];
            return (
              <Page
                styles={styles}
                value={value}
                {...props}
              />
            );
          })}
        </Grid>
        {value === 0
          ? <IconButton
              onTouchStart={(e) => {
                e.currentTarget.style = chatIconButtonAnimationDown;
                if (e.currentTarget === e.target) {
                  e.currentTarget.querySelector('svg').style = chatIconAnimationDown;
                }
              }}
              onMouseDown={(e) => {
                e.currentTarget.style = chatIconButtonAnimationDown;
                if (e.currentTarget === e.target) {
                  e.currentTarget.querySelector('svg').style = chatIconAnimationDown;
                }
              }}
              onTouchEnd={(e) => {
                e.currentTarget.style = chatIconButtonAnimationUp;
                if (e.currentTarget === e.target) {
                  e.currentTarget.querySelector('svg').style = chatIconAnimationUp;
                }
              }}
              onMouseUp={(e) => {
                e.currentTarget.style = chatIconButtonAnimationUp;
                if (e.currentTarget === e.target) {
                  e.currentTarget.querySelector('svg').style = chatIconAnimationUp;
                }
              }}
              onClick={() => setIsStartMessagingActive(true)}
              sx={{
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                right: '30px',
                bottom: '30px',
                backgroundColor: '#ffffff',
                borderRadius: '50%',
                width: '50px',
                height: '50px',
                boxShadow: '#aca7a7 0px 0px 14px 0px',
                ':hover': {
                  backgroundColor: '#ffffff'
                },
                '@media (hover : none)': {
                  ':hover': {
                    backgroundColor: '#ffffff'
                  }
                }
              }}
            >
            <BsFillChatDotsFill
              onTouchStart={(e) => { e.currentTarget.style = chatIconAnimationDown; }}
              onMouseDown={(e) => { e.currentTarget.style = chatIconAnimationDown; }}
              onTouchEnd={(e) => { e.currentTarget.style = chatIconAnimationUp; }}
              onMouseUp={(e) => { e.currentTarget.style = chatIconAnimationUp; }}
              size='25px'
              style={{
                color: `${theme.palette.primary.dark}`
              }}
            />
          </IconButton>
          : null}
      </Grid>
    </Grid>
  );
}
