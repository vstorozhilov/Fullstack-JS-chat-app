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
import { useFetch } from "react-async";

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

    const [value, setValue] = React.useState(0);
    const [prevValue, setPrevValue] = React.useState(-1);
    const theme = useTheme();
    const user = useContext(authentificationContext);
    const navigate = useNavigate();

    const isOnceRendered = useSelector(state => state.dialogsReducer.IsOnceRendered);
    const dispatch = useDispatch();

    function updateCredentials(){

      console.log("Called");

      fetch("http://localhost:8090/main", {
        mode: "cors",
        method : "GET",
        headers : {"Authorization" : user.login + ":" + user.password,
                    "Tab" : "main"}
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
          else {
            /* TO DO */
          }
        });

    }

    //if (!isOnceRendered) updateCredentials();

    useEffect(()=>{
      if (!Object.keys(user).length) {
        navigate('/login');
      }
      if (isOnceRendered === false) {
        dispatch({type : 'SET_IS_DIALOG_PAGE_ONCE_RENDERED'});
        updateCredentials();
      }
      //updateCredentials();
  }, [])

    const handleChange = (event, newValue) => {
      setValue((prev)=>{setPrevValue(prev); return newValue;});
    };

    const TabPages = [
      ({ styles, value }) => <TabPanel style={styles} value={value} index={0}><ChatItems isOnceRendered={isOnceRendered}/></TabPanel>,
      ({ styles, value, ...props }) => <TabPanel style={styles} value={value} index={1}><Contacts {...props}/></TabPanel>,
      ({ styles, value, ...props }) => <TabPanel style={styles} value={value} index={2}><Profile/></TabPanel>,
    ]

    const transitions = useTransition(value, 
      {
        from: prevValue < value ? {transform: 'translateX(100%)'} : {transform: 'translateX(-100%)'},
        enter: {transform: 'translateX(0%)'},
        leave: prevValue < value ? {transform: 'translateX(-100%)'} : {transform: 'translateX(100%)'},
      });

    return (Object.keys(user).length &&
        <Fragment>
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
                    '& .MuiTabs-indicator' :{
                      height: '0.65vh',
                      backgroundColor: theme.palette.secondary.text,
                      borderRadius: '1vh'
                    },
                    '& .MuiButtonBase-root' :{
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
        </Fragment>
    );
  }