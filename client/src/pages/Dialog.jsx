
import React, { useEffect, useContext, useRef, useState } from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import { AppTextField } from '../components/CommonComponents/TextField';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import { useSelector, useDispatch } from 'react-redux';
import SendIcon from '@mui/icons-material/Send';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { authentificationContext } from '../Routes';
import MessagesContainer from '../components/DialogComponents/MessagesContainer';
import DialogHeader from '../components/DialogComponents/DialogHeader';
import { useTheme } from '@mui/material';

export function Dialog (props) {
  const [isLoadingUpdates, setIsLoadingUpdates] = useState(false);
  const dialogContainerRef = useRef(null);
  const { user: { token } } = useContext(authentificationContext);
  const selectedDialog = useSelector(state => state.selectDialogReducer.selectedDialog);
  console.log(selectedDialog);
  const messageField = useRef(null);
  const dispatch = useDispatch();
  const theme = useTheme();

  function getMessages () {
    setIsLoadingUpdates(true);
    fetch('/api/dialog', {
      mode: 'cors',
      method: 'POST',
      headers: { Authorization: token },
      body: JSON.stringify({
        action: 'fetch messages',
        dialogId: selectedDialog
      })
    }).then((response) => {
      if (response.status === 200) {
        response.json().then(data => {
          console.log(data[0]);
          dispatch({ type: 'SET_MESSAGES', value: data[0] });
          dispatch({ type: 'SET_PEER', value: data[1] });
          setIsLoadingUpdates(false);
        });
      }
    });
  }

  function sendMessage () {
    fetch('/api/dialog', {
      mode: 'cors',
      method: 'POST',
      headers: { Authorization: token },
      body: JSON.stringify({
        action: 'message was sended',
        content: messageField.current.querySelector('.MuiOutlinedInput-input').value,
        dialogId: selectedDialog
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
  }, []);

  return (
    <>
      <Grid
        container
        justifyContent='center'
        height='100%'
        width='100%'
      >
        <Grid
          item
          height='100%'
          sx={{
            overflowY: 'hidden',
            [theme.breakpoints.up('tablet')]: {
              width: '600px'
            },
            [theme.breakpoints.down('tablet')]: {
              width: '100%'
            },
            position: 'relative',
            backgroundColor: 'rgb(255, 255, 255, 0.7)',
            overflowX: 'hidden'
          }}
        >
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
              flexWrap='nowrap'
              minHeight='0px'
            >
              <DialogHeader setReverseAnim={props.setReverseAnim} isLoadingUpdates={isLoadingUpdates} />
              <MessagesContainer ref={dialogContainerRef} isLoadingUpdates={isLoadingUpdates} />
            </Grid>
            <Grid
              container
              direction='row'
              justifyContent='center'
              alignItems='center'
              flexWrap='nowrap'
              sx={{
                width: 'inherit',
                height: '140px',
                marginBottom: '20px',
                marginTop: '10px'
              }}
            >
              <AppTextField
                ref={messageField}
                multiline
                maxRows={4}
                minRows={2}
                onKeyDown={(event) => { keydownHandler(event); }}
                sx={{
                  width: '80%',
                  '& .MuiOutlinedInput-input': {
                    paddingLeft: '3vw',
                    paddingRight: '3vw',
                    paddingTop: '20px',
                    paddingBottom: '20px'
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
        </Grid>
      </Grid>
    </>
  );
}
