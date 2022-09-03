import logo from './logo.svg';
import './App.css';
import React, { Component, Fragment, useState, useRef, useEffect, componentDidMount } from 'react';
import { Routes, Route, Link, BrowserRouter } from "react-router-dom";
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
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { StyledBlueButton, CustomButton } from './BigBlueButton';
import { useSelector } from 'react-redux'
import { authentificationContext } from './Routes';
import { useContext } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';

function handleAvatarChange(event){

    let file = event.target.files[0];
    let reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = ()=>
      {document.querySelector('#ava').src = reader.result}

  }

export default function Profile(props) {

    //const theme = useTheme()

    const [isEditable, setEditibility] = useState(false);
    const {user} = useContext(authentificationContext);

    console.log(isEditable);

    const profile = useSelector(state=>state.userReducer.User.profile);
    const nickname = useRef(null);
    const fullname = useRef(null);
    const avatar = useRef(null);
    const email = useRef(null);
    const birthdate = useRef(null);
    const about = useRef(null);
    const button = useRef(null);
    const maxheightMatch = useMediaQuery('(max-height: 700px)');

    function changeProfile() {

      button.current.disabled = true;
      button.current.innerHTML = 'uploading...';

      let newprofile = {
        avatar : avatar.current.src,
        fullname : fullname.current.querySelector('.MuiOutlinedInput-input').value,
        nickname : nickname.current.querySelector('.MuiOutlinedInput-input').value,
        birthdate : birthdate.current.querySelector('.MuiOutlinedInput-input').value,
        email : email.current.querySelector('.MuiOutlinedInput-input').value,
        about : about.current.querySelector('.MuiOutlinedInput-input').value
      }

      fetch("http://localhost:8090/main", {
        mode: "cors",
        method : "POST",
        headers : {"Authorization" : user.login + ":" + user.password,
                    "Tab" : "profile"},
        body : JSON.stringify(newprofile)
      }).then((response)=>{
          if (response.status === 200){
            button.current.disabled = false;
            button.current.innerHTML = 'Edit';
          }
          else {
            /* TO DO */
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
            <Grid item sx={{position: 'relative',
                            width: `${maxheightMatch ? "15vh" : '22vh'}`,
                            height: `${maxheightMatch ? "15vh" : '22vh'}`,
                            marginBottom: '2vh'}}>
                      <div style={{height: '100%',
                                    width: '100%',
                                    borderRadius: '50%',
                                    overflow: 'hidden',
                                    position: 'absolute'}}>
                        <img src={profile.avatar} ref={avatar} style={maxheightMatch ? {height: '15vh', width: '15vh'} : {height: '22vh', width: '22vh'}} id='ava'/>
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
                        disabled={!isEditable}
                        onChange={(event)=>{handleAvatarChange(event);}}/>
                        { isEditable &&
                        <IconButton
                            color="primary"
                            aria-label="upload picture"
                            component="span">
                          <Mode sx={{height: '4vh',
                                    width: '4vh',
                                    color: 'white',
                                    backgroundColor: '#246bfd',
                                    borderRadius: '1.5vh'}}/>
                        </IconButton>
                        }
                      </label>
            </Grid>
            <Grid item>
              <AppTextField
              disabled={!isEditable}
              defaultValue={profile.fullname}
              ref={fullname}
              label='Full Name'
              width='90vw'
              height='4vh'/>
            </Grid>
            <Grid item>
              <AppTextField disabled={!isEditable} ref={nickname} defaultValue={profile.nickname} label='Nickname' width='90vw' height='3vh'/>
            </Grid>
            <Grid item>
              <BirthdayPicker disabled={!isEditable} ref={birthdate} initValue={profile.birthdate} label='Birth Date' width='90vw' height='3vh'/>
            </Grid>
            <Grid item>
              <AppTextField disabled={!isEditable} ref={email} defaultValue={profile.email} label='Email' width='90vw' height='3vh'/>
            </Grid>
            <Grid item>
              <AppTextField disabled={!isEditable} ref={about} defaultValue={profile.about} label='About' width='90vw' height='3vh'/>
            </Grid>
            <Grid item>
                <CustomButton
                variant="contained"
                ref={button}
                onClick={()=>{
                  if (isEditable) changeProfile();
                  setEditibility(!isEditable);
                  }
                }
                >
                  {isEditable === false ? 'Edit' :  'Save'}
                </CustomButton>
            </Grid>
          </Grid>
        </Grid>
      </LocalizationProvider>
    </Fragment>
    )
}