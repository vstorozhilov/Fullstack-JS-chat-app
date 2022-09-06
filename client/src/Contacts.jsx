import logo from './logo.svg';
import './App.css';
import React, { Component, Fragment, useState, useEffect, componentDidMount, useRef, useContext } from 'react';
import { Routes, Route, Link, BrowserRouter } from "react-router-dom";
import { useSpring, animated } from 'react-spring'
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
import Avatar from '@mui/material/Avatar';
import { useTransition } from '@react-spring/web';
import authentificationContext from './contexts/authentificationContext';
import {useSelector, useDispatch} from 'react-redux';
import { dialogIsSelected } from './databaseSubscriber';
import {useNavigate} from "react-router-dom";

function ContactItem(props) {

    const {user : {login}, user : {password}} = useContext(authentificationContext);

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const theme = useTheme();

    const handleClick = (e) => {

        fetch("http://localhost:8090/main", {
            mode : "cors",
            method : "POST",
            headers : {"Authorization" : login + ":" + password},
            body : JSON.stringify({
                action : "startNewDialog",
                peerLogin : props.contact.login
            })}).then(response=>{
                if (response.status === 200){
                    response.json().then(([doesExist, dialog])=>{
                        if (!doesExist) dispatch({type: 'INSERT_DIALOG', value: dialog});
                        dispatch({type: 'SET_SELECTED_DIALOG', value: dialog._id});
                        dialogIsSelected(dialog._id);
                        navigate("/dialog");
                    })
                }
                else {
                    /* TO DO */
                }
            });
        }

    const itemPointDownAnimation = `animation-name : chatItemAnimationDown;
    animation-duration : 0.3s;
    background-color : #00dfff`;
    const itemPointUpAnimation = `animation-name : chatItemAnimationUp;
    animation-duration : 0.3s;
    background-color : #ffffff`;

    return (
        <Grid container
            direction='row'
            justifyContent='flex-start'
            onClick={props.isStartingNewDialogWindow ? handleClick : ()=>{}}
            onTouchStart={e=>{e.currentTarget.style = itemPointDownAnimation}}
            onMouseDown={e=>{e.currentTarget.style = itemPointDownAnimation}}
            onTouchEnd={e=>{e.currentTarget.style = itemPointUpAnimation}}
            onMouseUp={e=>{e.currentTarget.style = itemPointUpAnimation}}
            wrap='nowrap'>
                <Grid item
                sx={{
                    position : "relative"
                }}>
                    <Avatar
                    src={props.contact.profile.avatar}
                    sx={{
                    bgcolor: 'red',
                    width: '7vh',
                    height: '7vh' }}>OP</Avatar>
                    <div hidden={!props.contact.isOnline}
                        style={{
                        width: "2vh",
                        heigth: "2vh",
                        position: "absolute",
                        backgroundColor : "#00ff00",
                        borderRadius: "50%",
                        width: "2vh",
                        height: "2vh",
                        bottom: "0",
                        left: "5vh"
                    }}></div>
                </Grid>
                <Grid container
                    direction='row'
                    justifyContent='space-between'
                    wrap='nowrap'>
                    <Grid container
                    direction='column'
                    justifyContent='space-between'>
                        <Grid item
                        sx={{
                            paddingLeft: '10px',
                            fontWeight: theme.typography.fontWeightExtraBold,
                            fontSize: '2.5vh'
                            }}>{props.contact.profile.nickname}</Grid>
                        <Grid item
                        sx={{
                            paddingLeft: '10px',
                            fontWeight: theme.typography.fontWeightRegular,
                            color: '#616161'
                            }}>{props.contact.profile.fullname}
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
    )
}

export function Contacts(props) {

    const contacts = useSelector(state => Object.values(state.contactsReducer.Contacts));
    const {user : {login}} = useContext(authentificationContext);

    return (
            <Grid container
            direction='column'
            justifyContent='flex-start'
            rowSpacing={2}
            flexGrow="1"
            sx={{
                paddingLeft : `${props.isStartingNewDialogWindow ? "3vw" : "0"}`
            }}
            overflowY="scroll">
                {contacts.map((value, index)=>{
                if (value.login !== login)
                    return <Grid item key={index}>
                        <ContactItem isStartingNewDialogWindow={props.isStartingNewDialogWindow} contact={value}/>
                    </Grid>})}
            </Grid>                                       
    )
}