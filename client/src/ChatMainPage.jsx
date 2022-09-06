import logo from './logo.svg';
import './App.css';
import React, { Component, Fragment, useState, useEffect, componentDidMount, useMemo } from 'react';
import { Routes, Route, Link, BrowserRouter, useNavigate } from "react-router-dom";
import { useSpring, animated, useTransition} from '@react-spring/web'
import greetImage from './images/1.jpg';
import loginImage from './images/2.png'
import avatarImage from './images/avatar.png'
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import {TextField, Button, IconButton, Checkbox, Input} from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {ArrowBack, PhotoCamera, Mode, Search, DensityMedium} from '@mui/icons-material'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import {Event} from '@mui/icons-material';
import InputAdornment from '@mui/material/InputAdornment';
import {BigBlueButton as CommonButton} from './BigBlueButton'
import { AppTextField } from './TextField';
import { useTheme } from '@mui/material/styles';
import { BirthdayPicker } from './BirthdayPicker';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import zIndex from '@mui/material/styles/zIndex';
import { ChatItems } from './ChatItem';
import { Contacts } from './Contacts';
import {useSelector, useDispatch} from 'react-redux';
import Profile from './Profile';
import { authentificationContext } from './Routes';
import { useContext } from 'react';
import databaseSubscriber from './databaseSubscriber';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import { useFetch } from "react-async";
import {BsFillChatDotsFill} from "react-icons/bs"
import CloseIcon from '@mui/icons-material/Close';



function TabPanel(props) {
    const { children, value, index, style, ...other } = props;

    return (
      <animated.div
        role="tabpanel"
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        style={Object.assign(style, {position: 'absolute', width: 'inherit'})}
        {...other}
      >
        {  
          <Box sx={{p : 3, width: '100%'}}>        
            {children}
          </Box>
        }
      </animated.div>
    );
  }
  
  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };
  
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  export default function BasicTabs(props) {

    const [isStartMessagingActive, setIsStartMessagingActive] = useState(false);

    const [value, setValue] = React.useState(0);
    const [prevValue, setPrevValue] = React.useState(-1);
    const theme = useTheme();
    const {user} = useContext(authentificationContext);
    const navigate = useNavigate();

    const isOnceRendered = useSelector(state => state.dialogsReducer.IsOnceRendered);
    const dispatch = useDispatch();

    function updateCredentials(){

      console.log("Called");

      fetch("http://localhost:8090/main", {
        mode: "cors",
        method : "POST",
        headers : {"Authorization" : user.login + ":" + user.password},
        body : JSON.stringify({action : "updateAll"})
      }).then((response)=>{
          if (response.status === 200){
            response.json().then(([contacts, dialogs, user])=>{
              console.log(dialogs);
              dispatch({type : "SET_CONTACTS", value : contacts});
              dispatch({type : "SET_DIALOGS", value : dialogs});
              dispatch({type : "SET_USER", value : user});
              databaseSubscriber(user.login);
            });
          }
        });

    }

    useEffect(()=>{
      if (!Object.keys(user).length) {
        navigate('/login');
      }
      if (isOnceRendered === false) {
        dispatch({type : 'SET_IS_DIALOG_PAGE_ONCE_RENDERED'});
        updateCredentials();
      }
  }, [])

    const handleChange = (event, newValue) => {
      setValue((prev)=>{setPrevValue(prev); return newValue;});
    };

    const TabPages = [
      ({ styles, value }) => <TabPanel style={styles} value={value} index={0}><ChatItems isOnceRendered={isOnceRendered}/></TabPanel>,
      ({ styles, value, ...props }) => <TabPanel style={styles} value={value} index={1}><Contacts isStartingNewDialogWindow={false} {...props}/></TabPanel>,
      ({ styles, value, ...props }) => <TabPanel style={styles} value={value} index={2}><Profile/></TabPanel>,
    ]

    const transitions = useTransition(value, 
      {
        from: prevValue < value ? {transform: 'translateX(100%)'} : {transform: 'translateX(-100%)'},
        enter: {transform: 'translateX(0%)'},
        leave: prevValue < value ? {transform: 'translateX(-100%)'} : {transform: 'translateX(100%)'},
      });

    const chatIconAnimationDown = "animation-name : chatIconAnimationDown; animation-duration: 0.25s; color : #ffffff;";
    const chatIconAnimationUp = `animation-name : chatIconAnimationUp; animation-duration: 0.25s; color : ${theme.palette.primary.dark};`;
    const chatIconButtonAnimationDown = `animation-name : chatIconButtonAnimationDown; animation-duration: 0.25s; background-color : ${theme.palette.primary.dark};`;
    const chatIconButtonAnimationUp = `animation-name : chatIconButtonAnimationUp; animation-duration: 0.25s; background-color : #ffffff;`;

    return (Object.keys(user).length &&
        <Fragment>
            {isStartMessagingActive ?
            <Fragment>
              <div
                style={{
                zIndex : "1",
                position : "absolute",
                width: "100%",
                height: "100%",
                backgroundColor: "#a7a7a7",
                opacity: "0.8"

              }}>
              </div>
              <Grid container
              justifyContent="center"
              alignItems="center"
              sx={{
                height : "100%",
                zIndex: "2",
                position : "absolute",
                width : "100%",
                animationDuration : "0.3s",
                animationName: "slidein",
                animationTimingFunction : "cubic-bezier(0, 1.05, 0.94, 1.02)",
                "@keyframes slidein" : {
                  'from' : {
                    opacity : "0",
                    marginTop : '100%'
                  },
                  'to' : {
                    opacity : "1",
                    marginTop : '0%'
                  }}
                }}>
                <Grid item
                  hidden={!isStartMessagingActive}
                  sx={{
                    opacity: "1",
                    backgroundColor : "#ffffff",
                    height: "90vh",
                    width: "90vw",
                    borderRadius: "3vw"
                  }}>
                      <Grid container
                      direction="row"
                      justifyContent='flex-start'
                      alignItems="center"
                      columnSpacing={3}
                      sx={{
                        background : `linear-gradient(to right, #4f89ff, #2d71fd)`,
                        paddingTop : "1vh",
                        paddingBottom : "1vh",
                        marginBottom : "3vh",
                        marginLeft: "0",
                        width: "100%"
                      }}>
                          <Grid item>
                            <CloseIcon
                            onClick={()=>setIsStartMessagingActive(false)}
                            fontSize='large'
                            sx={{
                                color: '#ffffff'
                            }} />
                          </Grid>
                          <Grid item sx={{
                            fontSize: "3vh",
                            fontWeight: theme.typography.fontWeightBold,
                            color: theme.palette.secondary.text
                          }}>
                            Choose your contact
                          </Grid>
                      </Grid>
                    <Contacts isStartingNewDialogWindow/>
                </Grid>
              </Grid>
            </Fragment> : null
            }
            <header style={{
              background: `linear-gradient(to right, #4f89ff, #2d71fd)`,
              color: theme.palette.secondary.text
               }}>
                <Grid container
                    width='100%'
                    direction='row'
                    justifyContent='space-between'>
                    <Grid container width='fit-content'>
                        <Grid item
                        sx={{fontWeight: '600',
                            fontSize: '2.5vh',
                            marginTop: '2vh',
                            marginLeft: '5vw'}}>
                            HiChat
                        </Grid>
                    </Grid>
                    <Grid container width='fit-content'>
                        <Grid item>
                            <IconButton>
                                <Search sx={{
                                color: theme.palette.secondary.text,
                                marginTop: '1vh'
                                }} fontSize="large"/> 
                            </IconButton>
                        </Grid>
                        <Grid item>
                            <IconButton>
                                <DensityMedium sx={{
                                    color: theme.palette.secondary.text,
                                    marginTop: '1vh'
                                    }} fontSize="large"/> 
                            </IconButton>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container
                direction='row'
                justifyContent='center'
                width='100%'>
                  <Tabs value={value}
                  onChange={handleChange}
                  textColor="inherit"
                  aria-label="basic tabs example"
                  sx={{
                    '& .MuiTabs-indicator' : {
                      height: '0.65vh',
                      backgroundColor: theme.palette.secondary.text,
                      borderRadius: '1vh'
                    },
                    '& .MuiButtonBase-root' : {
                      textTransform: 'none',
                      width: '30vw',
                      fontSize: '2vh'
                    }
                  }}
                  >
                      <Tab label="Chats" {...a11yProps(0)}/>
                      <Tab label="Contacts" {...a11yProps(1)}/>
                      <Tab label="Profile" {...a11yProps(2)}/>
                  </Tabs>
                </Grid>
              </header>
              {transitions((styles, item)=>{
                const Page = TabPages[item];
                return <Page styles={styles}
                value={value}
                {...props}
                /> 
              })}
              {value === 0 ?
                <IconButton
                onTouchStart={(e)=>{
                  e.currentTarget.style = chatIconButtonAnimationDown;
                  if (e.currentTarget === e.target) {
                    e.currentTarget.querySelector('svg').style = chatIconAnimationDown;
                  }
                }}
                onMouseDown={(e)=>{
                  e.currentTarget.style = chatIconButtonAnimationDown;
                  if (e.currentTarget === e.target) {
                    e.currentTarget.querySelector('svg').style = chatIconAnimationDown;
                  }
                }}
                onTouchEnd={(e)=>{
                  e.currentTarget.style = chatIconButtonAnimationUp;
                  if (e.currentTarget === e.target) {
                    e.currentTarget.querySelector('svg').style = chatIconAnimationUp;
                  }
                }}
                onMouseUp={(e)=>{
                  e.currentTarget.style = chatIconButtonAnimationUp;
                  if (e.currentTarget === e.target) {
                    e.currentTarget.querySelector('svg').style = chatIconAnimationUp;
                  }
                }}
                onClick={()=>setIsStartMessagingActive(true)}
                sx={{
                  justifyContent : "center",
                  alignItems: "center",
                  position: "absolute",
                  right : "5vw",
                  bottom : "5vw",
                  backgroundColor: "#ffffff",
                  borderRadius: "50%",
                  width: "7vh",
                  height: "7vh",
                  boxShadow : "#aca7a7 0px 0px 14px 0px",
                  ":hover": {
                    backgroundColor : "#ffffff"
                  },
                  "@media (hover : none)" : {
                    ":hover": {
                      backgroundColor : "#ffffff"
                    }
                  },
                }}>
                  <BsFillChatDotsFill
                  onTouchStart={(e)=>{e.currentTarget.style = chatIconAnimationDown}}
                  onMouseDown={(e)=>{e.currentTarget.style = chatIconAnimationDown}}
                  onTouchEnd={(e)=>{e.currentTarget.style = chatIconAnimationUp}}
                  onMouseUp={(e)=>{e.currentTarget.style = chatIconAnimationUp}}
                  size="4vh"
                  style={{
                    color : `${theme.palette.primary.dark}`,
                  }}
                  />
                </IconButton> : null
              }
        </Fragment>
    );
  }