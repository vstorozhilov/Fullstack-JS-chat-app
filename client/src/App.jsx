import logo from './logo.svg';
import './App.css';
import React, { Component, Fragment, useState, useEffect, componentDidMount } from 'react';
import { Routes, Route, Link, BrowserRouter, useNavigate } from "react-router-dom";
import { useSpring, animated } from 'react-spring'
import greetImage from './images/1.jpg';
import loginImage from './images/2.png'
import avatarImage from './images/avatar.png'
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import {TextField, Button, IconButton, Checkbox, Input} from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {ArrowBack, PhotoCamera, Mode} from '@mui/icons-material'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import {Event} from '@mui/icons-material';
import InputAdornment from '@mui/material/InputAdornment';
import {BigBlueButton as CommonButton} from './BigBlueButton'
import { AppTextField } from './TextField';
import { useTheme } from '@mui/material/styles';
import { BirthdayPicker } from './BirthdayPicker';
import Grid from '@mui/material/Grid';
import {Visibility, VisibilityOff} from '@mui/icons-material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useLocation } from 'react-router-dom'
import { useContext } from 'react';
import { authentificationContext } from './Routes'
import { io } from "socket.io-client";
import databaseSubscriber from './databaseSubscriber';
import {useSelector, useDispatch} from "react-redux";
import { useRef } from "react";
// import WorkerBuilder from './workerBuilder';
// import worker from './databaseSubscriber';

//React.createContext()

function AppActionButton(props) {

  const {user, setUser} = useContext(authentificationContext);
  const [login, setLogin] = useState();
  const [password, setPassword] = useState();
  const [isAuthDataCorrect, setIsAuthDataCorrect] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const handlePassword = () => setShowPassword(!showPassword);

  const dispatch = useDispatch();

  console.log(setUser);

  const maxheightMatch = useMediaQuery('(max-height: 700px)');

    function sendAuthorizationForm(){

      setIsLoading(true);

      fetch("http://localhost:8090/login", {
        mode: "cors",
        method : "POST",
        headers : {"Authorization" : login + ":" + password}
      }).then((response)=>{
          if (response.status === 200){
            response.json().then((profile)=>{
              dispatch({type : "SET_USER", value : {login, password, profile}});
              localStorage.setItem('user',
                JSON.stringify({
                  login,
                  password
                }));
                setUser({login, password});
              //databaseSubscriber(login);
              navigate("/main");
            });
          }
          else {
            setIsAuthDataCorrect(false);
            setIsLoading(false);
          }
        });

    }

    return(
      <Grid container
      direction='column'
      justifyContent="space-between"
      height='100%'
      alignItems='center'>
        <Grid container direction='column' alignItems='center' id="topAlignedContainer">
          <Grid item sx={{alignSelf: 'flex-start'}}>
            <Link to='/home' onClick={()=>{props.setReverseAnim(true)}}>
              <IconButton  size='large'>
                <ArrowBack
                sx={{
                  color: '#000000'
                }}/>
              </IconButton>
            </Link>
          </Grid>
          <Grid item sx={{
            paddingTop : '10vh',
            paddingBottom : maxheightMatch ? '0' : '8vh',
          }}>
            <img src={loginImage}
              style={{height: '130px',
              width: '130px'}}/>
          </Grid>
          <Grid item>
          <p style={{
              fontWeight: theme.typography.fontWeightBold,
              fontSize: "4vh",
              textAlign: "center",
              marginTop: "0",
              marginBottom: "8vh"}}>Login to Your Account</p>
          </Grid>
          <Grid item>
            <AppTextField id="loginField" label='Your login' width='90vw' onChange={(e)=>setLogin(e.target.value)} disabled={isLoading}/>
          </Grid>
          <Grid item
            sx={{paddingTop :'2vh'}}>
            <AppTextField
              id="passwordField"
              label='Your password'
              width='90vw'
              disabled={isLoading}
              type={showPassword ? "text" : "password"}
              onChange={(e)=>setPassword(e.target.value)}
              InputProps={{
                  endAdornment: (
                  <InputAdornment position="end">
                      <IconButton
                          onClick={handlePassword}
                      >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                  </InputAdornment>
                  )
              }}/>
          </Grid>
          <Grid item
            hidden={isAuthDataCorrect}
            sx={{
              fontSize : "2.3vh",
              marginTop: "1vh",
              color : "red"
            }}>
              <div>Incorrect login or password</div>
          </Grid>
          <Grid container 
          flexDirection='row'
          justifyContent='center'
          alignItems='center'
          height='10vh'>
            <Checkbox size='large' sx={{color: '#256cfd'}}/>
            <span style={{fontWeight: theme.typography.fontWeightBold}}>Remember Me</span>
          </Grid>
          <Grid item>
            <CommonButton onClick={sendAuthorizationForm} text='Sign In' target="/main"/>
          </Grid>
        </Grid>
        <Grid item sx={{marginBottom: '5vh'}}>
          <span>Don't have an account?</span>
          <span><Link to='/loginpassword' style={{color: '#246bfd'}}>Sign Up</Link></span>
        </Grid>
      </Grid>
    )
}


function  AppActionButtonCreateAccount(props) {

  const theme = useTheme()
  const {user, setUser} = useContext(authentificationContext);
  const navigate = useNavigate();
  const [loading, setIsLoading] = useState(false);

  const nickname = useRef(null);
  const fullname = useRef(null);
  const avatar = useRef(null);
  const email = useRef(null);
  const birthdate = useRef(null);
  const about = useRef(null);

  function handleAvatarChange(event){

    let file = event.target.files[0];
    let reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = ()=>
      {
        avatar.current.src = reader.result;
      }
  }

  function sendAuthorizationForm(){
    
    setIsLoading(true);

    fetch("http://localhost:8090/signup", {
      mode: "cors",
      method : "POST",
      headers : {"Authorization" : user.login + ":" + user.password},
      body : JSON.stringify({
        avatar : avatar.current.src,
        fullname : fullname.current.querySelector('.MuiOutlinedInput-input').value,
        nickname : nickname.current.querySelector('.MuiOutlinedInput-input').value,
        birthdate : birthdate.current.querySelector('.MuiOutlinedInput-input').value,
        email : email.current.querySelector('.MuiOutlinedInput-input').value,
        about : about.current.querySelector('.MuiOutlinedInput-input').value
      })
    }).then((response)=>{
        if (response.status === 200) {
          setUser({
            ...user
          });
          navigate("/main");
        }
        else {
          setIsLoading(false);
        }
      });
  }

  return(
    <Fragment>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Grid container
              direction="column"
              alignItems='center'
              height='100%'
              justifyContent='space-between'>
          <Grid container
                direction="column"
                alignItems='center'
                spacing='2vh'>
            <Grid container
            sx={{height: '8vh',
                wigth: 'inherit',
                paddingLeft: '3vw',
                paddingTop: '3vw'}}
            direction="row"
            justifyContent='start'
            alignItems='center'
            gap='5vw'>
              <Grid item>
                <Link to='/loginpassword' onClick={()=>{props.setReverseAnim(true)}}>
                  <IconButton  size='large'>
                  <ArrowBack sx={{
                  color: '#000000'
                }} />
                  </IconButton>
                </Link>
              </Grid>
              <Grid item
              sx={{
                fontWeight: theme.typography.fontWeightBold,
                fontSize: '3vh'
              }}>
                  Fill Your Profile
              </Grid>
            </Grid>
            <Grid item sx={{position: 'relative',
            width: '22vh',
            height: '22vh',
            marginBottom: '3vh'}}>
                      <div style={{height: '100%',
                                    width: '100%',
                                    borderRadius: '50%',
                                    overflow: 'hidden',
                                    position: 'absolute'}}>
                        <img src={avatarImage} ref={avatar} style={{height: '22vh', width: '22vh'}} id='ava'/>
                      </div>
                      <label htmlFor="icon-button-file" style={{
                        position: 'absolute',
                        zIndex: '1',
                        top: '15vh',
                        left: '15vh',
                        width: '4vh',
                        height: '4vh'
                      }}>
                        <Input accept="image/*"
                        id="icon-button-file" 
                        type="file"
                        style={{display: 'none'}}
                        onChange={(event)=>{handleAvatarChange(event);}}/>
                        <IconButton color="primary" aria-label="upload picture" component="span">
                          <Mode sx={{height: '4vh',
                                    width: '4vh',
                                    color: 'white',
                                    backgroundColor: '#246bfd',
                                    borderRadius: '1.5vh'}}/>
                        </IconButton>
                      </label>
            </Grid>
            <Grid item>
              <AppTextField label='Full Name' width='90vw' height='4vh' ref={fullname}/>
            </Grid>
            <Grid item>
              <AppTextField label='Nickname' width='90vw' height='4vh' ref={nickname}/>
            </Grid>
            <Grid item>
              <BirthdayPicker initValue={new Date()} label='Birth Date' width='90vw' height='4vh' ref={birthdate}/>
            </Grid>
            <Grid item>
              <AppTextField label='Email' width='90vw' height='4vh' ref={email}/>
            </Grid>
            <Grid item>
              <AppTextField label='About' width='90vw' height='4vh' ref={about}/>
            </Grid>
          </Grid>
          <Grid item
          sx={{
            paddingBottom: '2vh'
          }}>
            <CommonButton text='Continue'
              target="/main"
              onClick={sendAuthorizationForm}/>
          </Grid>
        </Grid>
      </LocalizationProvider>
    </Fragment>
  )
}

function  AppActionButton_2(props) {

  console.count('AppActionButton_2');

  const maxheightMatch = useMediaQuery('(max-height: 700px)');

  const theme = useTheme();
  let reader = new FileReader();

  return(
    <Grid container
    alignItems='center'
    direction='column'
    justifyContent='space-between'
    height='100%'>
    <Grid container alignItems='center' direction='column'>
      <Grid item sx={{paddingTop: '5vh',
        [theme.breakpoints.down('laptop')]: {
          width: '100%',
        },
        [theme.breakpoints.up('laptop')]: {
          width: '912px',
          height: "1069px"
        },}}>
        <img width='100%' height='100%' src={greetImage}/>
      </Grid>
      <Grid item>
        <p style={{
                  fontWeight: theme.typography.fontWeightBold,
                  fontSize: "4vh",
                  lineHeight: "3vh",
                  textAlign: "center",
                  color: theme.palette.secondary.main}}>Welcome to my Chat!</p>
      </Grid>
      <Grid item>
          <p style={{marginTop: 0,
                  lineHeight: '3vh',
                  fontWeight: theme.typography.fontWeightLight,
                  textAlign: "center"}}>
          The best messenger and chat app of the<br></br>
          century to make your day great</p>
      </Grid>

    </Grid>
      <Grid item>
        <CommonButton
        text='Get Started'
        target='/'
        sx={{marginBottom: '5.5vh'}}/>
      </Grid>
    </Grid>
  )
}

export { AppActionButton, AppActionButton_2, AppActionButtonCreateAccount };