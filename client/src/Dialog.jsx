import logo from './logo.svg';
import './App.css';
import React, { Component, Fragment, useState, useEffect, componentDidMount, useMemo } from 'react';
import { Routes, Route, Link, BrowserRouter } from "react-router-dom";
import { useSpring, animated, useTransition} from '@react-spring/web'
import greetImage from './images/1.jpg';
import loginImage from './images/2.png'
import avatarImage from './images/avatar.png'
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import {TextField, Button, IconButton, Checkbox, Input} from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {ArrowBack, PhotoCamera, Mode, Search, DensityMedium, ForkRight} from '@mui/icons-material'
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
import { ChatItems } from './ChatItem'
import { Contacts } from './Contacts'
import {useSelector, useDispatch} from 'react-redux';
import SnackbarContent from '@mui/material/SnackbarContent';
import SendIcon from '@mui/icons-material/Send';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import Avatar from '@mui/material/Avatar';
import { authentificationContext } from './Routes';
import { useContext, useRef } from "react";
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import { InView } from 'react-intersection-observer';

import { exitFromDialog } from './databaseSubscriber';

const MyMessageStyled = styled(SnackbarContent)(({theme})=>`
    background-color : ${theme.palette.primary.light};
    border-radius : 5vw;
    max-width: 60vw;
    min-width: fit-content;
    box-shadow: none;
    word-break: break-all;
`)

const PeerMessageStyled = styled(SnackbarContent)(({theme})=>`
    background-color : ${theme.palette.secondary.contrastText};
    border-radius : 5vw;
    color: black;
    max-width: 60vw;
    min-width: fit-content;
    box-shadow: none;
    word-break: break-all;
`)


function MyMessage(props) {

    const theme = useTheme();

    return (
        <Grid item
        alignSelf='end'
        paddingRight='3vw'
        //bgcolor={props.isReaded ? "transparent" : "gray"}
        >
            <animated.div style={props.styles}>
                <Grid container
                flexDirection="row"
                justifyContent="center"
                alignItems="center"
                gap="2vw">
                <div hidden={props.isReaded} style={{
                    backgroundColor : "blue",
                    borderRadius : "50%",
                    width : "1vh",
                    height : "1vh"
                    }}>
                </div>
                <MyMessageStyled message={props.message}/>
                </Grid>
            </animated.div>
        </Grid>
    )
}

function PeerMessage(props) {

    const theme = useTheme();

    return (
        <Grid item
        alignSelf='start'
        marginLeft='3vw'
        >
            <animated.div style={props.styles}>
                <PeerMessageStyled  message={props.message}/>
            </animated.div>
        </Grid>
    )
}

const RefPeerMessage = React.forwardRef((props, ref)=>{

    return (
        <Grid item
        ref={ref}
        alignSelf='start'
        marginLeft='3vw'
        //bgcolor="red"
        >
            <animated.div style={props.styles}>
            <Grid container
                flexDirection="row"
                justifyContent="center"
                alignItems="center"
                gap="2vw">
                <PeerMessageStyled  message={props.message}/>
                <div style={{
                    backgroundColor : "blue",
                    borderRadius : "50%",
                    width : "1vh",
                    height : "1vh"
                    }}>
                </div>
            </Grid>
            </animated.div>
        </Grid>
    )
})

const RefMyMessage = React.forwardRef((props, ref)=>{

    // useEffect(()=>{
    //     ref.current.scrollTo(0, ref.current.scrollHeight);
    // }, [])

    return (
        <Grid item
        ref={ref}
        alignSelf='end'
        paddingRight='3vw'
        //bgcolor={props.inView ? "red" : "green"}
        >
            <animated.div style={props.styles}>
            <Grid container
                flexDirection="row"
                justifyContent="center"
                alignItems="center"
                gap="2vw">
                    <div hidden={props.isReaded} style={{
                        backgroundColor : "blue",
                        borderRadius : "50%",
                        width : "1vh",
                        height : "1vh"
                        }}>
                    </div>
                    <MyMessageStyled  message={props.message}/>
            </Grid>
            </animated.div>
        </Grid>
    )
})

const ObservedComponent = (MessageComponent, props) => {

    const {messageId, ...forwardedProps} = props;

    const user = useContext(authentificationContext);
    //console.log(props.root);
    
    //console.log(props.ref.current);

    function isReadedNotification(inView) {
        //if (IsJustMounted) {setIsJustMounted(false); return;};
        //if (inView) console.log('notification called');
        if (inView) {
        console.log("notified");
        fetch("http://localhost:8090/dialog", {
        mode: "cors",
        method : "POST",
        headers : {"Authorization" : user.login + ":" + user.password,
                    "messageid" : messageId},
        //body : props.messageId
        }).then((response)=>{
            if (response.status === 200){
            // response.json().then(data=>{
            //     console.log(data);
            //     //dispatch({type : "SET_MESSAGES", value : data});
            // })
            }
            else {
            /* TO DO */
            }
        });
    }
        
    }

    //const dispatch = useDispatch();
    //const isReaded = useSelector(state=>state.messagesReducer.Messages[props.id].isReaded);

    return(<InView root={props.root} threshold={0.9} triggerOnce onChange={inView=>isReadedNotification(inView)}>
      {({ inView, ref}) => (
        <MessageComponent ref={ref} inView={inView} {...forwardedProps}/>
      )}
    </InView>)
};

// const ObservedMessage = (props) => {


//     return (<InView threshold={1} as="div" onChange={()=>console.log('Visible')}>
//         <Grid item
//         alignSelf='end'
//         paddingRight='3vw'
//         >
//             <animated.div style={props.styles}>
//                 <MyMessageStyled message={props.message}/>
//             </animated.div>
//         </Grid>
//         </InView>
//     )
// }

const MessagesContainer = React.forwardRef((props, ref)=>{

    const theme = useTheme();

    const user = useContext(authentificationContext);
    const [isDialogFullyScrolled, setisDialogFullyScrolled] = useState(false);

    const correctMessages = useSelector(state=>state.messagesReducer.Messages);

    // console.log(isDialogFullyScrolled);

    const transitions = useTransition(Object.values(correctMessages), 
        {
            from : { opacity: 0},
            enter : { opacity: 1},
            config: {duration: 300}
        })
    
    useEffect(()=>{
        if (Object.keys(correctMessages).length) {
            if (ref.current.offsetHeight + ref.current.scrollTop >=
                ref.current.scrollHeight - 2){
                setisDialogFullyScrolled(true);
            }
            if (isDialogFullyScrolled){
                ref.current.scrollTo(0, ref.current.scrollHeight);
            }
        }
    })

    const NotReadedMessagesCount = useSelector(state=>(
        Object.values(state.messagesReducer.Messages).filter(item=>(item.isReaded === false && item.author === props.peerLogin))).length
    )

    return <div
    onScroll={()=>{
        if (ref.current.offsetHeight + ref.current.scrollTop >=
                ref.current.scrollHeight - 2){
            setisDialogFullyScrolled(true);
        }
        else {
            setisDialogFullyScrolled(false);
        }
    }}
    ref={ref}
    style={{
        position : "relative",
        flexGrow  : "1",
        overflowY : "scroll",
        scrollBehavior : "smooth",
        minHeight : "0px"
    }}>
        <Grid container
        direction="row"
        justifyContent="center"
        alignItems="center"
        width="fit-content"
        spacing={1}
        sx={{
            position : "fixed",
            zIndex : "10",
            bottom : "15vh",
            right : "7vw",
        }}        >
            <Grid item
            hidden={NotReadedMessagesCount === 0}>
                <div style={{
                    backgroundColor : "blue",
                    borderRadius : "50%",
                    textAlign : "center",
                    width: "3vh",
                    height: "3vh",
                    color : "white",
                    boxShadow : "#868686 0px 0px 10px 0px",
                }}>
                    {NotReadedMessagesCount}
                </div>
            </Grid>
            <Grid item
            hidden={isDialogFullyScrolled}>
                <IconButton
                onClick={(e)=>{
                    ref.current.scrollTo(0, ref.current.scrollHeight);
                }}
                sx={{
                    boxShadow : "0px 0px 10px 0px #252525",
                    backgroundColor : "#ffffff",
                    ":hover" : {
                        backgroundColor : "#ffffff"
                    }
                }}>
                    <KeyboardDoubleArrowDownIcon/>
                </IconButton>
            </Grid>
        </Grid>
    <Grid container
    id="messagesContainer"
    spacing={2}
    direction='column'
    paddingTop='2vh'
    wrap='nowrap'
    sx={{
        marginTop: '0',
        scrollBehavior: 'smooth'
    }}>
        {transitions((styles, item, t, i)=>{
            return (user.login === item.author ?
                <MyMessage
                styles={item.isReaded ? {} : styles}
                message={item.content}
                isReaded={item.isReaded}/>
            : item.isReaded?
                <PeerMessage
                //styles={styles}
                message={item.content}/> :
            ObservedComponent(RefPeerMessage, {
                root : ref.current,
                styles : styles,
                message : item.content,
                messageId : item._id
            }));
            // <PeerMessage
            // styles={styles}
            // message={item.content}
            // />);
        })}
        
        {/* {correctMessages.map((item, index)=>{
            return (user.login === item.author ? <MyMessage
                key={index}
                //styles={styles}
                message={item.content}
                /> : <PeerMessage
                //styles={styles}
                key={index}
                message={item.content}
                />);
        })} */}
    </Grid>
    </div>
})

// function MessagesContainer() {

//     const user = useContext(authentificationContext);

//     const correctMessages = useSelector(state=>state.messagesReducer.Messages);

//     const transitions = useTransition(correctMessages, 
//         {
//             // onStart: ()=>{
//             //     if (isDialogFullyScrolled === true) {
//             //         let messagesContainer = document.querySelector('#messagesContainer');
//             //         messagesContainer.scrollTo(0, messagesContainer.scrollHeight);
//             //         setDialogFullyScrolled(false);
//             //     }
//             // },
//             from : {transform: 'translateY(50%)', opacity: 0},
//             enter : {transform: 'translateY(0%)', opacity: 1},
//             config: {duration: 300}
//         })

//     return <div style={{
//         flexGrow  : "1",
//         overflowY : "scroll",
//         minHeight : "0px"
//     }}>
//     <Grid container
//     id="messagesContainer"
//     spacing={2}
//     direction='column'
//     paddingTop='2vh'
//     wrap='nowrap'
//     sx={{
//         overflowY: 'scroll',
//         marginTop: '0',
//         scrollBehavior: 'smooth'
//     }}>
//         {transitions((styles, item, t, i)=>{
//             return (user.login === item.author ? <MyMessage
//             styles={styles}
//             message={item.content}
//             /> : <PeerMessage
//             styles={styles}
//             message={item.content}
//             />);
//         })}
//         {/* {correctMessages.map((item, index)=>{
//             return (user.login === item.author ? <MyMessage
//                 key={index}
//                 //styles={styles}
//                 message={item.content}
//                 /> : <PeerMessage
//                 //styles={styles}
//                 key={index}
//                 message={item.content}
//                 />);
//         })} */}
//     </Grid>
//     </div>
// }

export function Dialog(props){

    const theme = useTheme();

    const [isDialogFullyScrolled, setIsDialogFullyScrolled] = useState(false);

    const dialogContainerRef = useRef(null);

    //const [isDialogFullyScrolled, setDialogFullyScrolled] = useState(false);
    const user = useContext(authentificationContext);

    const dialogId = useSelector(state=>state.dialogsReducer.selectedDialog);

    const peerLogin = useSelector(state=>{
        let currentDialog = state.dialogsReducer.Dialogs[dialogId];
        return user.login === currentDialog.peerOne ? currentDialog.peerTwo : currentDialog.peerOne;
    });

    // const NotReadedMessagesCount = useSelector(state=>(
    //     Object.values(state.messagesReducer.Messages).filter(item=>(item.isReaded === false && item.author === peerLogin))).length
    //     )

    // console.log(NotReadedMessagesCount);

    const peerAvatar = useSelector(state=>state.contactsReducer.Contacts[peerLogin].profile.avatar);

    const isPeerOnline = useSelector(state=>state.contactsReducer.Contacts[peerLogin].isOnline);

    console.log(isPeerOnline);

    const messageField = useRef(null);

    const dispatch = useDispatch();

    function getMessages() {
        console.log('called');
        fetch("http://localhost:8090/dialog", {
        mode: "cors",
        method : "GET",
        headers : {"Authorization" : user.login + ":" + user.password,
                    "Dialogid" : dialogId},
      }).then((response)=>{
          if (response.status === 200){
            response.json().then(data=>{
                console.log(data);
                dispatch({type : "SET_MESSAGES", value : data});
            })
          }
          else {
            /* TO DO */
          }
        });
    }

    // if (!isMessagesRequested) getMessages();

    function sendMessage() {

        //console.log(user.login);
        //console.log(messageField.current.querySelector('.MuiOutlinedInput-input').value);

        fetch("http://localhost:8090/dialog", {
        mode: "cors",
        method : "POST",
        headers : {"Authorization" : user.login + ":" + user.password,
                    // "Peer" : peerLogin,
                    "Dialogid" : dialogId},
        body : messageField.current.querySelector('.MuiOutlinedInput-input').value
      }).then((response)=>{
          if (response.status === 200){
            //console.log("Success");
            console.log(dialogContainerRef.current);
            dialogContainerRef.current.scrollTo(0, dialogContainerRef.current.scrollHeight);
          }
          else {
            /* TO DO */
          }
        });
        // let messagesContainer = document.querySelector('#messagesContainer');
        // if (messagesContainer.scrollHeight === (Math.round(messagesContainer.scrollTop, 0) + messagesContainer.offsetHeight)) {
        //     setDialogFullyScrolled(true);
        // }
        // let textfield = document.querySelector('#input-with-text-message');
        // let message = textfield.value;
        // textfield.value = '';
        // if (message === '')
        //     return ;
        // dispatch({type : 'SET_MESSAGES', value : message});
    }

    function keydownHandler(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            sendMessage();
        }
    }

    useEffect(()=>{
        getMessages();
        return (exitFromDialog);
    }, []);

    //getMessages();

    // const messages = useSelector(state => state.messagesReducer.Messages);
    // const selectedDialog = useSelector(state => state.dialogsReducer.selectedDialog);

    // console.log(selectedDialog);

    // const transitions = useTransition(correctMessages, 
    //     {
    //         onStart: ()=>{
    //             if (isDialogFullyScrolled === true) {
    //                 let messagesContainer = document.querySelector('#messagesContainer');
    //                 messagesContainer.scrollTo(0, messagesContainer.scrollHeight);
    //                 setDialogFullyScrolled(false);
    //             }
    //         },
    //         from : {transform: 'translateY(50%)', opacity: 0},
    //         enter : {transform: 'translateY(0%)', opacity: 1},
    //         config: {duration: 300}
    //     })

    console.log('RRRRRRRRRRRRRRRRRRendered');

    return (
    <Fragment>
        <Grid container
        direction='column'
        justifyContent='space-between'
        height='inherit'
        flexWrap="nowrap">
            <Grid container
             direction='column'
             flexGrow={1}
             flexWrap="nowrap"
             minHeight="0px">
                <header style={{
                background: `linear-gradient(to right, #4f89ff, #2d71fd)`,
                color: theme.palette.secondary.text,
                minHeight: '10vh'
                }}>
                    <Grid container
                        width='100%'
                        height='100%'
                        direction='row'
                        justifyContent='space-between'
                        flexWrap='nowrap'>
                        <Grid container
                        width='fit-content'
                        alignItems='center'
                        flexWrap='nowrap'>
                            <Grid item>
                                <Link to='/main' onClick={()=>{props.setReverseAnim(true)}}>
                                <IconButton 
                                size='large'
                                sx={{
                                    marginLeft: '1vw',
                                    color: theme.palette.secondary.text
                                }}
                                >
                                    <ArrowBack />
                                </IconButton>
                                </Link>
                            </Grid>
                            <Grid item sx={{
                                paddingRight: '2vw',
                                position: "relative"
                            }}>
                                <Avatar
                                src={peerAvatar}
                                sx={{
                                bgcolor: 'red',
                                width: '7vh',
                                height: '7vh' }}></Avatar>
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
                            <Grid item
                            sx={{fontWeight: '600',
                                fontSize: '2.5vh'}}>
                                {peerLogin}
                            </Grid>
                        </Grid>
                        <Grid container
                        width='fit-content'
                        alignItems='center'>
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
                </header>
                <MessagesContainer ref={dialogContainerRef} peerLogin={peerLogin}/>
            </Grid>
            <Grid container
            direction='row'
            justifyContent='center'
            alignItems='center'
            id="messageInputContainer"
            sx={{
                width :'inherit',
                minHeight: '15vh'
            }}>
                <AppTextField
                 ref={messageField}
                 id="input-with-text-message"
                 width='80vw'
                 height='8vh'
                 multiline
                 maxRows={4}
                 minRows={2}
                 onKeyDown={(event)=>{keydownHandler(event)}}
                 sx={{
                    '& .MuiOutlinedInput-input' : {
                        paddingLeft: '3vw',
                        paddingRight: '3vw',
                        paddingTop: '2vw',
                        paddingBottom: '2vw',
                        fontSize: '2.2vh',
                    },
                    '& .MuiOutlinedInput-input::-webkit-scrollbar' : {
                        backgroundColor: 'transparent'
                    }
                 }}
                 InputProps={{
                    endAdornment: (
                    <InputAdornment position="end">
                        <IconButton>
                            <PhotoCameraIcon/>
                        </IconButton>
                        <IconButton>
                            <AttachFileIcon/>
                        </IconButton>
                    </InputAdornment>
                    )
                }}/>
                <IconButton onClick={()=>{sendMessage()}}>
                    <SendIcon
                    fontSize='large' color='primary'/>
                </IconButton>
            </Grid>
        </Grid>
    </Fragment>
    );
}