
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTransition } from '@react-spring/web';
import { IconButton, useTheme } from '@mui/material';
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
  const location = useLocation();

  // console.log(useSelector(state => state.messagesReducer.Messages));

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
          console.log(dialogs);
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
    <>
      {isStartMessagingActive
        ? <StartNewDialog
            isStartMessagingActive={isStartMessagingActive}
            setIsStartMessagingActive={setIsStartMessagingActive}
          />
        : null}
      <MainPageHeader tabIndexer={{ value, setValue, setPrevValue }} setReverseAnim={props.setReverseAnim} />
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
              right: '5vw',
              bottom: '5vw',
              backgroundColor: '#ffffff',
              borderRadius: '50%',
              width: '7vh',
              height: '7vh',
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
            size='4vh'
            style={{
              color: `${theme.palette.primary.dark}`
            }}
          />
          </IconButton>
        : null}
    </>
  );
}

// export default function WrappedMain (props) {
//   return (
//     <DynamicModuleLoader modules={[MainPageModule()]}>
//       <Main {...props} />
//     </DynamicModuleLoader>
//   );
// }
