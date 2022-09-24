
import React, { useState, useRef, useContext } from 'react';
import { Input, IconButton } from '@mui/material';
import { Mode } from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AppTextField } from '../CommonComponents/TextField';
import { BirthdayPicker } from '../CommonComponents/BirthdayPicker';
import Grid from '@mui/material/Grid';
import { CustomButton } from '../CommonComponents/BigBlueButton';
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

    fetch('/api/main', {
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
          spacing='2vh'
          height='100%'
          margin='0'
          flexWrap='nowrap'
        >
          <Grid
            item sx={{
              position: 'relative',
              width: '130px',
              height: '130px',
              marginBottom: '5vh'
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
              <img src={profile.avatar} ref={avatar} style={{ height: '130px', width: '130px' }} />
            </div>
            <label
              htmlFor='icon-button-file' style={{
                position: 'absolute',
                zIndex: '1',
                top: '110px',
                left: '110px',
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
                  sx={{
                    padding: '0'
                  }}
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
          <Grid
            container
            justifyContent='center'
            width='100%'
            paddingTop='1vh'
          >
            <AppTextField
              disabled={!isEditable}
              defaultValue={profile.fullname}
              ref={fullname}
              label='Full Name'
              width='90%'
              height='4vh'
            />
          </Grid>
          <Grid
            container
            justifyContent='center'
            width='100%'
            paddingTop='1vh'
          >
            <AppTextField disabled={!isEditable} ref={nickname} defaultValue={profile.nickname} label='Nickname' sx={{ width: '90%' }} />
          </Grid>
          <Grid
            container
            justifyContent='center'
            width='100%'
            paddingTop='1vh'
          >
            <BirthdayPicker disabled={!isEditable} ref={birthdate} initValue={profile.birthdate} label='Birth Date' sx={{ width: '90%', '& .MuiOutlinedInput-root': { paddingRight: '14px' }, '& .MuiInputAdornment-root': { display: `${isEditable ? 'flex' : 'none'}` } }} />
          </Grid>
          <Grid
            container
            justifyContent='center'
            width='100%'
            paddingTop='1vh'
          >
            <AppTextField disabled={!isEditable} ref={email} defaultValue={profile.email} label='Email' sx={{ width: '90%' }} />
          </Grid>
          <Grid
            container
            justifyContent='center'
            width='100%'
            paddingTop='1vh'
          >
            <AppTextField disabled={!isEditable} ref={about} defaultValue={profile.about} label='About' sx={{ width: '90%' }} />
          </Grid>
          <Grid
            container
            justifyContent='center'
            width='100%'
            paddingTop='3vh'
          >
            <Grid item width='90%'>
              <CustomButton
                variant='contained'
                ref={button}
                sx={{
                  width: '100%'
                }}
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
