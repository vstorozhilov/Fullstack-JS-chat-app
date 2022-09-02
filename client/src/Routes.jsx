import React from 'react';
import { AppActionButton, AppActionButton_2, AppActionButtonCreateAccount } from './App';
import { Route, Routes, Link, BrowserRouter, useLocation, Switch, useNavigate } from 'react-router-dom'
import { useSpring, animated, useTransition } from 'react-spring' 
import { useState, useMemo, useEffect } from 'react';
import { LoginPassword } from './LoaginPassword';
import BasicTabs from './ChatMainPage';
import { Dialog } from './Dialog'
import authentificationContext from './contexts/authentificationContext';

function MainContainer(props){

    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user')) || {};

    const [reverseAnimation, setReverseAnimation] = useState(false);
    const transitions = useTransition(location, { enter: ()=>{return { opacity: 1, transform: 'translateX(0%)' }},
                                                from: { opacity: location.pathname === '/main' || location.pathname === '/dialog' ? 1 : 0,
                                                transform: reverseAnimation === true ? 'translateX(-100%)' : 'translateX(100%)'},
                                                leave: { opacity: location.pathname === '/main' || location.pathname === '/dialog' ? 1 : 0,
                                                transform: reverseAnimation === true ? 'translateX(100%)': 'translateX(-100%)'},
                                                config: {delay: 10, duration: 200, tension: 340},
                                                onRest : ()=>{if (reverseAnimation === true){setReverseAnimation(false);}}
                                            })

    return transitions((props, item) => {
            return <animated.div style={Object.assign(props, {position: 'absolute', width: 'inherit', height: 'inherit', overflowX: 'hidden'})}>
                <authentificationContext.Provider value={user}>
                    <Routes location={item}>
                        <Route path="/login" element={<AppActionButton setReverseAnim={setReverseAnimation}/>} />
                        <Route path="/home" element={<AppActionButton_2 text="Click me now"/>} />
                        <Route path="/loginpassword" element={<LoginPassword setReverseAnim={setReverseAnimation}/>} />
                        <Route path="/signup" element={<AppActionButtonCreateAccount setReverseAnim={setReverseAnimation}/>} />
                        <Route path="/main" element={<BasicTabs/>} />
                        <Route path="/dialog" element={<Dialog setReverseAnim={setReverseAnimation}/>} />
                    </Routes>
                </authentificationContext.Provider>
            </animated.div>
    })
}

export {MainContainer, authentificationContext};
