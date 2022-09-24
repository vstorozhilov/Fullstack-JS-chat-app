
import React, { useState, useContext, useRef, useEffect } from 'react';
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
import { mainPageWillMount } from '../databaseSubscriber';

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

    fetch('/api/createaccount', {
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
          mainPageWillMount();
          navigate('/main');
        });
      } else if (response.status === 401) {
        response.json().then(responsePayment => {
          alert(responsePayment);
          setTimeout(() => navigate('/signup'), 3000);
        });
      }
    });
  }

  useEffect(() => {
    if (!(login && password)) navigate('/signup');
  }, [login, password]);

  return (login && password &&
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
            sx={{
              [theme.breakpoints.up('tablet')]: {
                width: '600px'
              },
              [theme.breakpoints.down('tablet')]: {
                width: '100%'
              }
            }}
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
                <Link to='/signup' onClick={() => { props.setReverseAnim(true); }}>
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
            <Grid
              container
              justifyContent='center'
              width='100%'
            >
              <AppTextField disabled={loading} label='Full Name' sx={{ width: '90%' }} ref={fullname} />
            </Grid>
            <Grid
              container
              justifyContent='center'
              width='100%'
              paddingTop='2vh'
            >
              <AppTextField disabled={loading} label='Nickname' sx={{ width: '90%' }} ref={nickname} />
            </Grid>
            <Grid
              container
              justifyContent='center'
              width='100%'
              paddingTop='2vh'
            >
              <BirthdayPicker disabled={loading} initValue={new Date()} label='Birth Date' sx={{ width: '90%', '& .MuiOutlinedInput-root': { paddingRight: '14px' } }} ref={birthdate} />
            </Grid>
            <Grid
              container
              justifyContent='center'
              width='100%'
              paddingTop='2vh'
            >
              <AppTextField disabled={loading} label='Email' sx={{ width: '90%' }} ref={email} />
            </Grid>
            <Grid
              container
              justifyContent='center'
              width='100%'
              paddingTop='2vh'
            >
              <AppTextField disabled={loading} label='About' sx={{ width: '90%' }} ref={about} />
            </Grid>
          </Grid>
          <Grid
            container
            justifyContent='center'
            width='100%'
            sx={{
              [theme.breakpoints.up('tablet')]: {
                width: '600px'
              },
              [theme.breakpoints.down('tablet')]: {
                width: '100%'
              },
              paddingBottom: '2vh'
            }}
          >
            {loading
              ? <BigBlueButton
                  text='uploading...'
                  sx={{
                    width: '90%'
                  }}
                />
              : <BigBlueButton
                  sx={{
                    width: '90%'
                  }}
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
