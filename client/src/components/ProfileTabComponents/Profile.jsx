import '../../App.css';
import React, { useState, useRef, useContext } from 'react';
import { Input, IconButton } from '@mui/material';
import { Mode } from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AppTextField } from '../../TextField';
import { BirthdayPicker } from '../../BirthdayPicker';
import Grid from '@mui/material/Grid';
import { CustomButton } from '../../BigBlueButton';
import { useSelector } from 'react-redux';
import { authentificationContext } from '../../Routes';
import useMediaQuery from '@mui/material/useMediaQuery';

export default function Profile (props) {
  const [isEditable, setEditibility] = useState(false);
  const [buttonText, setButtonText] = useState('Edit');
  const { user: { token } } = useContext(authentificationContext);
  const profile = useSelector(state => state.userReducer.User.profile);
  const nickname = useRef(null);
  const fullname = useRef(null);
  const avatar = useRef(null);
  const email = useRef(null);
  const birthdate = useRef(null);
  const about = useRef(null);
  const button = useRef(null);
  const maxheightMatch = useMediaQuery('(max-height: 700px)');

  function handleAvatarChange (event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = () => { avatar.current.src = reader.result; };
  }

  function changeProfile () {
    button.current.disabled = true;
    setButtonText('uploading...');

    const newprofile = {
      action: 'changeMyProfile',
      avatar: avatar.current.src,
      fullname: fullname.current.querySelector('.MuiOutlinedInput-input').value,
      nickname: nickname.current.querySelector('.MuiOutlinedInput-input').value,
      birthdate: birthdate.current.querySelector('.MuiOutlinedInput-input').value,
      email: email.current.querySelector('.MuiOutlinedInput-input').value,
      about: about.current.querySelector('.MuiOutlinedInput-input').value
    };

    fetch('http://localhost:8090/main', {
      mode: 'cors',
      method: 'POST',
      headers: { Authorization: token },
      body: JSON.stringify(newprofile)
    }).then((response) => {
      if (response.status === 200) {
        button.current.disabled = false;
        setEditibility(false);
        setButtonText('Edit');
      }
    });
  }

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Grid
          container
          direction='column'
          alignItems='center'
          height='100%'
          justifyContent='space-between'
        >
          <Grid
            container
            direction='column'
            alignItems='center'
            spacing='2vh'
          >
            <Grid
              item sx={{
                position: 'relative',
                width: `${maxheightMatch ? '15vh' : '22vh'}`,
                height: `${maxheightMatch ? '15vh' : '22vh'}`,
                marginBottom: '2vh'
              }}
            >
              <div style={{
                height: '100%',
                width: '100%',
                borderRadius: '50%',
                overflow: 'hidden',
                position: 'absolute'
              }}
              >
                <img src={profile.avatar} ref={avatar} style={maxheightMatch ? { height: '15vh', width: '15vh' } : { height: '22vh', width: '22vh' }} />
              </div>
              <label
                htmlFor='icon-button-file' style={{
                  position: 'absolute',
                  zIndex: '1',
                  top: '15vh',
                  left: '15vh',
                  width: '4vh',
                  height: '4vh'
                }}
              >
                <Input
                  accept='image/*'
                  id='icon-button-file'
                  type='file'
                  style={{ display: 'none' }}
                  disabled={!isEditable}
                  onChange={(event) => { handleAvatarChange(event); }}
                />
                {isEditable &&
                  <IconButton
                    color='primary'
                    aria-label='upload picture'
                    component='span'
                  >
                    <Mode sx={{
                      height: '4vh',
                      width: '4vh',
                      color: 'white',
                      backgroundColor: '#246bfd',
                      borderRadius: '1.5vh'
                    }}
                    />
                  </IconButton>}
              </label>
            </Grid>
            <Grid item>
              <AppTextField
                disabled={!isEditable}
                defaultValue={profile.fullname}
                ref={fullname}
                label='Full Name'
                width='90vw'
                height='4vh'
              />
            </Grid>
            <Grid item>
              <AppTextField disabled={!isEditable} ref={nickname} defaultValue={profile.nickname} label='Nickname' width='90vw' height='3vh' />
            </Grid>
            <Grid item>
              <BirthdayPicker disabled={!isEditable} ref={birthdate} initValue={profile.birthdate} label='Birth Date' width='90vw' height='3vh' />
            </Grid>
            <Grid item>
              <AppTextField disabled={!isEditable} ref={email} defaultValue={profile.email} label='Email' width='90vw' height='3vh' />
            </Grid>
            <Grid item>
              <AppTextField disabled={!isEditable} ref={about} defaultValue={profile.about} label='About' width='90vw' height='3vh' />
            </Grid>
            <Grid item>
              <CustomButton
                variant='contained'
                ref={button}
                onClick={(e) => {
                  if (isEditable) changeProfile(e);
                  else {
                    setEditibility(!isEditable);
                    setButtonText('Save');
                  }
                }}
              >
                {buttonText}
              </CustomButton>
            </Grid>
          </Grid>
        </Grid>
      </LocalizationProvider>
    </>
  );
}
