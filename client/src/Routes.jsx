import React, { useState } from 'react';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import { animated, useTransition } from 'react-spring';
import Main from './Pages/Main';
import { Dialog } from './Pages/Dialog';
import authentificationContext from './contexts/authentificationContext';
import { useSelector } from 'react-redux';
import Login from './Pages/Login';
import CreateAccount from './Pages/CreateAccount';
import SignUp from './Pages/SignUp';
import Greet from './Pages/Greet';

function MainContainer (props) {
  const location = useLocation();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || {});
  const contextUser = { user, setUser };

  console.log(user);

  const selectedDialog = useSelector(state => state.dialogsReducer.selectedDialog);

  const [reverseAnimation, setReverseAnimation] = useState(false);
  const transitions = useTransition(location, {
    enter: () => { return { opacity: 1, transform: 'translateX(0%)' }; },
    from: {
      opacity: location.pathname === '/main' || location.pathname === '/dialog' ? 1 : 0,
      transform: reverseAnimation === true ? 'translateX(-100%)' : 'translateX(100%)'
    },
    leave: {
      opacity: location.pathname === '/main' || location.pathname === '/dialog' ? 1 : 0,
      transform: reverseAnimation === true ? 'translateX(100%)' : 'translateX(-100%)'
    },
    config: { delay: 10, duration: 200, tension: 340 },
    onRest: () => { if (reverseAnimation === true) { setReverseAnimation(false); } }
  });

  return transitions((props, item) => {
    return (
      <animated.div style={Object.assign(props, { position: 'absolute', width: 'inherit', height: 'inherit', overflowX: 'hidden', overflowY: 'hidden' })}>
        <authentificationContext.Provider value={contextUser}>
          <Routes location={item}>
            <Route path='/login' element={<Login setReverseAnim={setReverseAnimation} />} />
            <Route path='/home' element={<Greet text='Click me now' />} />
            <Route path='/loginpassword' element={<SignUp setReverseAnim={setReverseAnimation} />} />
            <Route path='/signup' element={<CreateAccount setReverseAnim={setReverseAnimation} />} />
            <Route path='/main' element={<Main />} />
            <Route path='/dialog' element={selectedDialog === undefined ? <Navigate to='/main' /> : <Dialog setReverseAnim={setReverseAnimation} />} />
          </Routes>
        </authentificationContext.Provider>
      </animated.div>
    );
  });
}

export { MainContainer, authentificationContext };
