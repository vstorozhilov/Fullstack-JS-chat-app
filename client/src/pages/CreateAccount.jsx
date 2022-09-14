import '../App.css';
import React, { useState, useContext, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import avatarImage from '../images/avatar.png';
import { IconButton, Input, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { ArrowBack, Mode } from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { BigBlueButton } from '../components/CommonComponents/BigBlueButton';
import { AppTextField } from '../components/CommonComponents/TextField';
import { BirthdayPicker } from '../components/CommonComponents/BirthdayPicker';
import { authentificationContext } from '../Routes';

export default function CreateAccount (props) {
  const theme = useTheme();
  const { user: { login }, user: { password }, setUser } = useContext(authentificationContext);
  const navigate = useNavigate();
  const [loading, setIsLoading] = useState(false);
  const nickname = useRef(null);
  const fullname = useRef(null);
  const avatar = useRef(null);
  const email = useRef(null);
  const birthdate = useRef(null);
  const about = useRef(null);

  function handleAvatarChange (event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {
      avatar.current.src = reader.result;
    };
  }

  function sendAuthorizationForm () {
    setIsLoading(true);

    fetch('http://localhost:8090/signup', {
      mode: 'cors',
      method: 'POST',
      headers: { Authorization: login + ':' + password },
      body: JSON.stringify({
        avatar: avatar.current.src,
        fullname: fullname.current.querySelector('.MuiOutlinedInput-input').value,
        nickname: nickname.current.querySelector('.MuiOutlinedInput-input').value,
        birthdate: birthdate.current.querySelector('.MuiOutlinedInput-input').value,
        email: email.current.querySelector('.MuiOutlinedInput-input').value,
        about: about.current.querySelector('.MuiOutlinedInput-input').value
      })
    }).then((response) => {
      if (response.status === 200) {
        response.json().then(token => {
          localStorage.setItem('user', JSON.stringify({ login, token }));
          setUser({ login, token });
          navigate('/main');
        });
      } else if (response.status === 401) {
        response.json().then(responsePayment => {
          alert(responsePayment);
          setTimeout(() => navigate('/loginpassword'), 3000);
        });
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
              container
              sx={{
                height: '8vh',
                wigth: 'inherit',
                paddingLeft: '3vw',
                paddingTop: '3vw'
              }}
              direction='row'
              justifyContent='start'
              alignItems='center'
              gap='5vw'
            >
              <Grid item>
                <Link to='/loginpassword' onClick={() => { props.setReverseAnim(true); }}>
                  <IconButton size='large'>
                    <ArrowBack sx={{
                      color: '#000000'
                    }}
                    />
                  </IconButton>
                </Link>
              </Grid>
              <Grid
                item
                sx={{
                  fontWeight: theme.typography.fontWeightBold,
                  fontSize: '3vh'
                }}
              >
                Fill Your Profile
              </Grid>
            </Grid>
            <Grid
              item sx={{
                position: 'relative',
                width: '22vh',
                height: '22vh',
                marginBottom: '3vh'
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
                <img src={avatarImage} ref={avatar} style={{ height: '22vh', width: '22vh' }} id='ava' />
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
                  onChange={(event) => { handleAvatarChange(event); }}
                />
                <IconButton color='primary' aria-label='upload picture' component='span'>
                  <Mode sx={{
                    height: '4vh',
                    width: '4vh',
                    color: 'white',
                    backgroundColor: '#246bfd',
                    borderRadius: '1.5vh'
                  }}
                  />
                </IconButton>
              </label>
            </Grid>
            <Grid item>
              <AppTextField disabled={loading} label='Full Name' width='90vw' height='4vh' ref={fullname} />
            </Grid>
            <Grid item>
              <AppTextField disabled={loading} label='Nickname' width='90vw' height='4vh' ref={nickname} />
            </Grid>
            <Grid item>
              <BirthdayPicker disabled={loading} initValue={new Date()} label='Birth Date' width='90vw' height='4vh' ref={birthdate} />
            </Grid>
            <Grid item>
              <AppTextField disabled={loading} label='Email' width='90vw' height='4vh' ref={email} />
            </Grid>
            <Grid item>
              <AppTextField disabled={loading} label='About' width='90vw' height='4vh' ref={about} />
            </Grid>
          </Grid>
          <Grid
            item
            sx={{
              paddingBottom: '2vh'
            }}
          >
            {loading
              ? <BigBlueButton
                  text='uploading...'
                />
              : <BigBlueButton
                  text='Continue'
                  target='/main'
                  disabled={loading}
                  onClick={sendAuthorizationForm}
                />}
          </Grid>
        </Grid>
      </LocalizationProvider>
    </>
  );
}
