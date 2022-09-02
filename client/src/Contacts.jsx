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
import { useTransition } from '@react-spring/web'
import authentificationContext from './contexts/authentificationContext'
import {useSelector, useDispatch} from 'react-redux';

function ContactItem(props) {

    const theme = useTheme();

    return (
        <Grid container
            direction='row'
            justifyContent='flex-start'
            wrap='nowrap'>
                <Grid item>
                    <Avatar
                    src={props.contact.profile.avatar}
                    sx={{
                    bgcolor: 'red',
                    width: '7vh',
                    height: '7vh' }}>OP</Avatar>
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
    return (
            <Grid container
            direction='column'
            justifyContent='flex-start'
            rowSpacing={3}>
                {contacts.map((value, index)=>(
                <Grid item key={index}>
                    <ContactItem contact={value}/>
                </Grid>))}
            </Grid>                                       
    )
}