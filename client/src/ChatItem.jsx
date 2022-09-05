import logo from './logo.svg';
import './App.css';
import React, { Component, Fragment, useState, useEffect, useCallback, componentDidMount, useRef, useContext } from 'react';
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
import { useTransition } from '@react-spring/web'
import {useSelector, useDispatch} from 'react-redux';
import { authentificationContext } from './Routes';
import { dialogIsSelected } from './databaseSubscriber';
import NotDialogsYetImage from './images/NotDialogsYet.png'
import useMediaQuery from '@mui/material/useMediaQuery';
import {BsFillChatDotsFill} from "react-icons/bs";
import { useNavigate } from 'react-router-dom';

var zip = require('zip-array').zip;

function ChatItem(props) {

    const theme = useTheme();

    const {user : {login}} = useContext(authentificationContext);

    const {isReaded, author, content} = useSelector(state=>state.dialogsReducer.Dialogs[props.dialogId].lastMessage);

    const unreadedMessagesCount = useSelector(state=>state.dialogsReducer.Dialogs[props.dialogId].unreadedMessagesCount);

    const isPeerOnline = useSelector(state=>state.contactsReducer.Contacts[props.Login].isOnline);

    return (
        <Grid container
            direction='row'
            justifyContent='flex-start'
            wrap='nowrap'>
                <Grid item
                sx={{position : "relative"}}>
                    <Avatar
                    src={props.src}
                    sx={{
                    bgcolor: 'red',
                    width: '7vh',
                    height: '7vh' }}>OP</Avatar>
                    <div hidden={!isPeerOnline}
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
                    }}>
                    </div>
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
                            color: '#000000',
                            paddingLeft: '10px',
                            fontWeight: theme.typography.fontWeightExtraBold,
                            fontSize: '2.5vh'
                            }}>{props.Nickname}</Grid>
                        <Grid item
                        sx={{
                            paddingLeft: '3vw',
                            paddingRight: '2vw',
                            fontWeight: theme.typography.fontWeightRegular,
                            bgcolor : `${!isReaded ? login === author ? theme.palette.secondary.contrastText : "transparent" : "transparent"}`,
                            borderRadius : '2vw',
                            width: 'fit-content',
                            color: '#616161'
                            }}><span hidden={login !== author}
                            style={{
                                color : "#7300ff"
                            }}>You: </span>{content.length > 20 ? content.slice(0, 20) + '...' : content}
                        </Grid>
                    </Grid>
                    <Grid container
                    direction='column'
                    justifyContent='space-between'
                    alignItems='flex-end'>
                        <Grid item>
                            <div
                                hidden={unreadedMessagesCount === 0}
                                style={{
                                    paddingTop : '0.3vh',
                                    backgroundColor: theme.palette.primary.main,
                                    width: '3vh',
                                    height: '3vh',
                                    fontSize: '2vh',
                                    borderRadius: '50%',
                                    color: 'white',
                                    textAlign: 'center'
                                }}>
                                    {unreadedMessagesCount}
                            </div>
                        </Grid>
                        <Grid sx={{color: '#616161'}} item>Time</Grid>
                    </Grid>
                </Grid>
            </Grid>
    )

}

function NoDialogsYet(props){

    const IsWidthMatch = useMediaQuery('(max-width: 585px)')

    return (<Grid container
    direction="column"
    alignItems="center"
    sx={{
        paddingTop: "5vh"
    }}>
        <Grid item
        sx={{
            fontSize : "3vh"
        }}>
            <img src={NotDialogsYetImage} width={IsWidthMatch ? "100%" : "585px"}/>
        </Grid>
        <Grid item sx={{
            marginTop : "1vh",
            fontSize : "3vh",
            fontWeight: "700"
        }}>
            No dialogs yet...
        </Grid>
    </Grid>)
}

function ChatItemContainer({style, id, onClick, ...props}){

    const itemPointDownAnimation = `animation-name : chatItemAnimationDown;
    animation-duration : 0.3s;
    background-color : #00dfff;`;
    const itemPointUpAnimation = `animation-name : chatItemAnimationUp;
    animation-duration : 0.3s;
    background-color : #ffffff;`;

    return (<Grid item onClick={onClick} id={id} sx={style}
        onTouchStart={e=>{e.currentTarget.style = itemPointDownAnimation}}
        onMouseDown={e=>{e.currentTarget.style = itemPointDownAnimation}}
        onTouchEnd={e=>{e.currentTarget.style = itemPointUpAnimation}}
        onMouseUp={e=>{e.currentTarget.style = itemPointUpAnimation}}
        >
            <ChatItem {...props} dialogId={id}/>
        </Grid>);
}

export function ChatItems(props) {

    const dispatch = useDispatch();
    console.log('rendered');

    const navigate = useNavigate();

    const dialogs = useSelector(state => Object.values(state.dialogsReducer.Dialogs).filter(item=>(item.lastMessage !== null)));
    const contacts = useSelector(state => state.contactsReducer.Contacts);

    const {user : {login}} = useContext(authentificationContext);

    let avatars = dialogs.map(item=>{
        let peerLogin = (login === item.peerOne ? item.peerTwo : item.peerOne);
        return contacts[peerLogin].profile.avatar;
    })

    let dialogAvaPair = zip(dialogs, avatars)

    const handleClick = (e) => {
        dispatch({type: 'SET_SELECTED_DIALOG', value: e.currentTarget.id});
        dialogIsSelected(e.currentTarget.id);
        navigate('/dialog')
      };

    return (
            <Grid container
            direction='column'
            justifyContent='flex-start'
            rowSpacing={3}
            height="100%">
                {dialogs.length ? 
                    dialogAvaPair.filter(item=>(item[0].lastMessage !== null)).map((item, index)=>{
                        return <ChatItemContainer
                        key={index}
                        id={item[0]._id}
                        src={item[1]}
                        onClick={handleClick}
                        Nickname={login === item[0].peerOne ? item[0].peerTwo : item[0].peerOne}
                        Login={login === item[0].peerOne ? item[0].peerTwo : item[0].peerOne}
                        />}) : <NoDialogsYet/>
                }
            </Grid>                                       
    )
}