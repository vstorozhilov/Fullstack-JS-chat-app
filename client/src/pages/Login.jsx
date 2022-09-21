
import React, { useState, useContext, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import loginImage from '../images/2.png';
import { IconButton, Checkbox, useTheme, Grid } from '@mui/material';
import { Visibility, VisibilityOff, ArrowBack } from '@mui/icons-material';
import InputAdornment from '@mui/material/InputAdornment';
import { BigBlueButton } from '../components/CommonComponents/BigBlueButton';
import { AppTextField } from '../components/CommonComponents/TextField';
import useMediaQuery from '@mui/material/useMediaQuery';
import { authentificationContext } from '../Routes';
import { useDispatch } from 'react-redux';
import { mainPageWillMount } from '../databaseSubscriber';

export default function Login (props) {
  const { setUser } = useContext(authentificationContext);
  const [rememberMe, setRememberMe] = useState(false);
  const [isAuthDataCorrect, setIsAuthDataCorrect] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const handlePassword = () => setShowPassword(!showPassword);
  const dispatch = useDispatch();
  const maxheightMatch = useMediaQuery('(max-height: 700px)');
  const loginField = useRef(null);
  const passwordField = useRef(null);

  function sendAuthorizationForm () {
    setIsLoading(true);

    const login = loginField.current.querySelector('.MuiOutlinedInput-input').value;
    const password = passwordField.current.querySelector('.MuiOutlinedInput-input').value;

    fetch('/api/login', {
      mode: 'cors',
      method: 'POST',
      headers: { Authorization: login + ':' + password }
    }).then((response) => {
      if (response.status === 200) {
        response.json().then(([profile, token]) => {
          dispatch({ type: 'SET_USER', value: { login, profile } });
          if (rememberMe) localStorage.setItem('user', JSON.stringify({ login, token }));
          setUser({ login, token });
          mainPageWillMount();
          setIsLoading(false);
          navigate('/main');
        });
      } else if (response.status === 401) {
        setIsAuthDataCorrect(false);
        setIsLoading(false);
      }
    });
  }

  return (
    <Grid
      container
      direction='column'
      justifyContent='space-between'
      height='inherit'
      width='inherit'
      alignItems='center'
      flexWrap='nowrap'
    >
      <Grid
        container direction='column' alignItems='center' id='topAlignedContainer'
        sx={{
          [theme.breakpoints.up('tablet')]: {
            width: '600px'
          },
          [theme.breakpoints.down('tablet')]: {
            width: '100%'
          }
        }}
      >
        <Grid item sx={{ alignSelf: 'flex-start' }}>
          <Link to='/' onClick={() => { props.setReverseAnim(true); }}>
            <IconButton size='large'>
              <ArrowBack
                sx={{
                  color: '#000000'
                }}
              />
            </IconButton>
          </Link>
        </Grid>
        <Grid
          item sx={{
            paddingTop: '10vh',
            paddingBottom: maxheightMatch ? '0' : '8vh'
          }}
        >
          <img
            src={loginImage}
            alt='default login image'
            style={{
              height: '130px',
              width: '130px'
            }}
          />
        </Grid>
        <Grid item>
          <p style={{
            fontWeight: theme.typography.fontWeightBold,
            fontSize: '1.8rem',
            textAlign: 'center',
            marginTop: '0',
            marginBottom: '8vh'
          }}
          >Login to Your Account
          </p>
        </Grid>
        <Grid
          item sx={{
            width: '90%'
          }}
        >
          <AppTextField
            ref={loginField}
            label='Your login'
            width='100%'
            disabled={isLoading}
          />
        </Grid>
        <Grid
          item
          sx={{ paddingTop: '2vh', width: '90%' }}
        >
          <AppTextField
            label='Your password'
            width='100%'
            ref={passwordField}
            disabled={isLoading}
            type={showPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton
                    onClick={handlePassword}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </Grid>
        <Grid
          item
          hidden={isAuthDataCorrect}
          sx={{
            fontSize: '2.3vh',
            marginTop: '1vh',
            color: 'red'
          }}
        >
          <div>Incorrect login or password</div>
        </Grid>
        <Grid
          container
          flexDirection='row'
          justifyContent='center'
          alignItems='center'
          flexWrap='nowrap'
          sx={{
            height: '3rem',
            marginBottom: '1vh',
            marginTop: '1vh'
          }}
        >
          <Checkbox size='large' sx={{ color: '#256cfd' }} onChange={() => setRememberMe(!rememberMe)} />
          <span style={{ fontWeight: theme.typography.fontWeightBold }}>Remember Me</span>
        </Grid>
        <Grid item sx={{ width: '90%' }}>
          <BigBlueButton onClick={sendAuthorizationForm} text='Sign In' sx={{ width: '100%' }} />
        </Grid>
      </Grid>
      <Grid
        container
        direction='row'
        justifyContent='center'
        sx={{
          [theme.breakpoints.up('tablet')]: {
            width: '600px'
          },
          [theme.breakpoints.down('tablet')]: {
            width: '100%'
          },
          marginBottom: '5vh'
        }}
      >
        <span>Don't have an account?</span>
        <span><Link to='/signup' style={{ color: '#246bfd' }}>Sign Up</Link></span>
      </Grid>
    </Grid>
  );
}
