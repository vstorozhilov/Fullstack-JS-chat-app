import '../App.css';
import React, { useEffect, useContext, useRef } from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import { AppTextField } from '../components/CommonComponents/TextField';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import { useSelector, useDispatch } from 'react-redux';
import SendIcon from '@mui/icons-material/Send';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { authentificationContext } from '../Routes';
import { exitFromDialog } from '../databaseSubscriber';
import MessagesContainer from '../components/DialogComponents/MessagesContainer';
import DialogHeader from '../components/DialogComponents/DialogHeader';

export function Dialog (props) {
  const dialogContainerRef = useRef(null);
  const { user: { login }, user: { token } } = useContext(authentificationContext);
  const dialogId = useSelector(state => state.dialogsReducer.selectedDialog);
  const peerLogin = useSelector(state => {
    const currentDialog = state.dialogsReducer.Dialogs[dialogId];
    return login === currentDialog.peerOne ? currentDialog.peerTwo : currentDialog.peerOne;
  });
  const messageField = useRef(null);
  const dispatch = useDispatch();

  function getMessages () {
    fetch('http://localhost:8090/dialog', {
      mode: 'cors',
      method: 'POST',
      headers: { Authorization: token },
      body: JSON.stringify({
        action: 'fetch messages',
        dialogId
      })
    }).then((response) => {
      if (response.status === 200) {
        response.json().then(data => {
          console.log(data);
          dispatch({ type: 'SET_MESSAGES', value: data });
        });
      }
    });
  }

  function sendMessage () {
    fetch('http://localhost:8090/dialog', {
      mode: 'cors',
      method: 'POST',
      headers: { Authorization: token },
      body: JSON.stringify({
        action: 'message was sended',
        content: messageField.current.querySelector('.MuiOutlinedInput-input').value,
        dialogId
      })
    }).then((response) => {
      if (response.status === 200) {
        console.log(dialogContainerRef.current);
        dialogContainerRef.current.scrollTo(0, dialogContainerRef.current.scrollHeight);
      }
    });
  }

  function keydownHandler (event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (event.target.value !== '') {
        sendMessage();
        event.target.value = '';
      }
    }
  }

  useEffect(() => {
    getMessages();
    return (exitFromDialog);
  }, []);

  return (
    <>
      <Grid
        container
        direction='column'
        justifyContent='space-between'
        height='inherit'
        flexWrap='nowrap'
      >
        <Grid
          container
          direction='column'
          flexGrow={1}
          flexWrap='nowrap'
          minHeight='0px'
        >
          <DialogHeader setReverseAnim={props.setReverseAnim} peerLogin={peerLogin} />
          <MessagesContainer ref={dialogContainerRef} peerLogin={peerLogin} />
        </Grid>
        <Grid
          container
          direction='row'
          justifyContent='center'
          alignItems='center'
          id='messageInputContainer'
          sx={{
            width: 'inherit',
            minHeight: '15vh'
          }}
        >
          <AppTextField
            ref={messageField}
            id='input-with-text-message'
            width='80vw'
            height='8vh'
            multiline
            maxRows={4}
            minRows={2}
            onKeyDown={(event) => { keydownHandler(event); }}
            sx={{
              '& .MuiOutlinedInput-input': {
                paddingLeft: '3vw',
                paddingRight: '3vw',
                paddingTop: '2vw',
                paddingBottom: '2vw',
                fontSize: '2.2vh'
              },
              '& .MuiOutlinedInput-input::-webkit-scrollbar': {
                backgroundColor: 'transparent'
              }
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton>
                    <PhotoCameraIcon />
                  </IconButton>
                  <IconButton>
                    <AttachFileIcon />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <IconButton onClick={() => { sendMessage(); }}>
            <SendIcon
              fontSize='large' color='primary'
            />
          </IconButton>
        </Grid>
      </Grid>
    </>
  );
}
