import React, { useState, useEffect } from 'react';
import { Route, Routes, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { animated, useTransition } from 'react-spring';
import Main from './Pages/Main';
import { Dialog } from './Pages/Dialog';
import authentificationContext from './contexts/authentificationContext';
import { useSelector } from 'react-redux';
import Login from './Pages/Login';
import CreateAccount from './Pages/CreateAccount';
import SignUp from './Pages/SignUp';
import Greet from './Pages/Greet';
import { mainPageWillUnmount, dialogPageWillUnmount } from './databaseSubscriber';

function MainContainer (props) {
  const location = useLocation();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || {});
  const contextUser = { user, setUser };
  const navigate = useNavigate();

  console.log(user);

  const selectedDialog = useSelector(state => state.selectDialogReducer.selectedDialog);

  console.log(selectedDialog);

  const [reverseAnimation, setReverseAnimation] = useState(false);
  const transitions = useTransition(location, {
    enter: () => { return { opacity: 1, transform: 'translateX(0%)' }; },
    from: {
      transform: reverseAnimation === true ? 'translateX(-100%)' : 'translateX(100%)'
    },
    leave: {
      transform: reverseAnimation === true ? 'translateX(100%)' : 'translateX(-100%)'
    },
    config: { delay: 10, duration: 200, tension: 340 },
    onDestroyed: (item) => {
      if (reverseAnimation === true) {
        setReverseAnimation(false);
      }
      if ((item.pathname === '/main') && (location.pathname !== '/main')) {
        console.log('AAAAAAAAAAAAAAA');
        mainPageWillUnmount();
      }
      if ((item.pathname === '/dialog') && (location.pathname !== '/dialog')) {
        console.log('LLLLLLLLLLLLLL');
        dialogPageWillUnmount();
      }
    }
  });

  useEffect(() => {
    if (!Object.values(user).length) {
      if (location.pathname === '/main') {
        navigate('/login');
      }
    }
    if (Object.values(user).length) {
      if (location.pathname === '/login' || location.pathname === '/') {
        navigate('/main');
      }
    }
    if (selectedDialog === undefined && location.pathname === '/dialog') {
      navigate('/main');
    }
  }, [location]);

  return transitions((styles, item) => {
    return (
      <animated.div style={Object.assign(styles, { position: 'absolute', width: 'inherit', height: 'inherit', overflowX: 'hidden', overflowY: 'hidden' })}>
        <authentificationContext.Provider value={contextUser}>
          <Routes location={item}>
            <Route path='/login' element={Object.values(user).length ? null : <Login setReverseAnim={setReverseAnimation} />} />
            <Route path='/' element={Object.values(user).length ? null : <Greet text='Click me now' />} />
            <Route path='/signup' element={<SignUp setReverseAnim={setReverseAnimation} />} />
            <Route path='/createaccount' element={<CreateAccount setReverseAnim={setReverseAnimation} />} />
            <Route path='/main' element={Object.values(user).length ? <Main setReverseAnim={setReverseAnimation} /> : null} />
            <Route path='/dialog' element={selectedDialog === undefined ? null : <Dialog setReverseAnim={setReverseAnimation} />} />
          </Routes>
        </authentificationContext.Provider>
      </animated.div>
    );
  });
}

export { MainContainer, authentificationContext };
