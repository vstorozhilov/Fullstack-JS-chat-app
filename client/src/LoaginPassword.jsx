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
import {Event, Visibility, VisibilityOff} from '@mui/icons-material';
import InputAdornment from '@mui/material/InputAdornment';
import {BigBlueButton as CommonButton} from './BigBlueButton'
import { AppTextField } from './TextField';
import { useTheme } from '@mui/material/styles';
import { BirthdayPicker } from './BirthdayPicker';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import LoginPasswordImage from './images/loginpassword.png'
import useMediaQuery from '@mui/material/useMediaQuery';
import { useContext } from 'react';
import { authentificationContext } from './Routes';

export function LoginPassword(props) {

    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);
    const handlePassword = () => setShowPassword(!showPassword);
    const handleRepeatPassword = () => setShowRepeatPassword(!showRepeatPassword);

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [isAuthDataCorrect, setIsAuthDataCorrect] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [arePasswordsMatched, setArePasswordsMatched] = useState(true);
    const {user, setUser} = useContext(authentificationContext);
    const navigate = useNavigate();

    const theme = useTheme();

    const maxheightMatch = useMediaQuery('(max-height: 700px)');

    const passwordsMatchingHandler = (password, repeatPassword)=>{
      setArePasswordsMatched(password===repeatPassword);
    };

    function sendAuthorizationForm(){

      if (arePasswordsMatched === false ||
            login === '' ||
              password === '' ||
                repeatPassword === '') return;
      
      setIsLoading(true);

      fetch("http://localhost:8090/loginpassword", {
        mode: "cors",
        method : "POST",
        headers : {"Authorization" : login + ":" + password}
      }).then((response)=>{
          if (response.status === 200) {
            setUser({login, password});
            navigate("/signup");
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
          <Grid container
          direction='column'
          alignItems='center'>
            <Grid item sx={{alignSelf: 'flex-start'}}>
              <Link to='/login' onClick={()=>{props.setReverseAnim(true)}}>
                <IconButton  size='large'>
                  <ArrowBack sx={{
                  color: '#000000'
                }}/>
                </IconButton>
              </Link>
            </Grid>
            <Grid item sx={{
                  marginTop: maxheightMatch ? '0' : '5vh',
                  width: maxheightMatch ? '200px' : '300px',
                  height: maxheightMatch ? '175px' : '250px'
                }}>
              <img src={LoginPasswordImage} width='100%' height='100%'/>
            </Grid>
            <Grid item>
                    <p style={{
                        fontWeight: theme.typography.fontWeightBold,
                        fontSize: "5vh",
                        textAlign: "center",
                        marginTop: "0",
                        marginBottom: "4vh"}}>Let's you sign up</p>
            </Grid>
            <Grid container
            direction='column'
            alignItems='center'
            spacing='2vh'>
                <Grid item>
                    <AppTextField label='Your login'
                    width='90vw'
                    onChange={(e)=>{setLogin(e.target.value)}}
                    sx={login === '' ? {
                      '& .MuiOutlinedInput-notchedOutline' : {
                        border: 'solid 2px red',
                      }} : {}}
                    disabled={isLoading}/>
                </Grid>
                <Grid item>
                    <AppTextField
                    label='Your password'
                    width='90vw'
                    type={showPassword ? "text" : "password"}
                    disabled={isLoading}
                    sx={password === '' ? {
                      '& .MuiOutlinedInput-notchedOutline' : {
                        border: 'solid 2px red',
                      }} : {}}
                    onChange={(e)=>{
                      setPassword(e.target.value);
                      passwordsMatchingHandler(e.target.value, repeatPassword);
                    }
                  }
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
                <Grid item>
                    <AppTextField
                    label='Repeat password'
                    width='90vw'
                    disabled={isLoading}
                    type={showRepeatPassword ? "text" : "password"}
                    sx={repeatPassword === '' ? {
                      '& .MuiOutlinedInput-notchedOutline' : {
                        border: 'solid 2px red',
                      }} : {}}
                    onChange={(e)=>{
                                    setRepeatPassword(e.target.value);
                                    passwordsMatchingHandler(password, e.target.value);
                                  }
                                }
                    InputProps={{
                        endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                onClick={handleRepeatPassword}
                            >
                            {showRepeatPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                        </InputAdornment>
                        )
                    }}/>
                </Grid>
                <Grid sx={{
                  color: "red",
                  fontSize: "2vh"
                }}
                  item
                  hidden={arePasswordsMatched}>
                  <div>Passwords mismatched</div>
                </Grid>
                <Grid sx={{
                  color: "red",
                  fontSize: "2vh"
                }}
                  item
                  hidden={isAuthDataCorrect}>
                  <div>Current login is already in use</div>
                </Grid>
            </Grid>
          </Grid>
          <Grid item sx={{marginBottom: '5vh'}}>
            <CommonButton text='Sign Up' onClick={sendAuthorizationForm} target="/signup"/>
          </Grid>
        </Grid>
      )
  }