import '../App.css';
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IconButton, Grid, useTheme, useMediaQuery } from '@mui/material';
import { ArrowBack, VisibilityOff, Visibility } from '@mui/icons-material';
import InputAdornment from '@mui/material/InputAdornment';
import { BigBlueButton } from '../components/CommonComponents/BigBlueButton';
import { authentificationContext } from '../Routes';
import { AppTextField } from '../components/CommonComponents/TextField';
import LoginPasswordImage from '../images/loginpassword.png';

export default function SignUp (props) {
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const handlePassword = () => setShowPassword(!showPassword);
  const handleRepeatPassword = () => setShowRepeatPassword(!showRepeatPassword);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [isAuthDataCorrect, setIsAuthDataCorrect] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [arePasswordsMatched, setArePasswordsMatched] = useState(true);
  const { setUser } = useContext(authentificationContext);
  const navigate = useNavigate();
  const theme = useTheme();
  const maxheightMatch = useMediaQuery('(max-height: 700px)');
  const passwordsMatchingHandler = (password, repeatPassword) => {
    setArePasswordsMatched(password === repeatPassword);
  };
  console.log(setUser);

  function sendAuthorizationForm () {
    if (arePasswordsMatched === false ||
          login === '' ||
            password === '' ||
              repeatPassword === '') return;

    setIsLoading(true);

    fetch('http://localhost:8090/signup', {
      mode: 'cors',
      method: 'POST',
      headers: { Authorization: login }
    }).then((response) => {
      if (response.status === 200) {
        setUser({ login, password });
        navigate('/createaccount');
      }
      if (response.status === 401) {
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
      height='100%'
      alignItems='center'
    >
      <Grid
        container
        direction='column'
        alignItems='center'
      >
        <Grid item sx={{ alignSelf: 'flex-start' }}>
          <Link to='/login' onClick={() => { props.setReverseAnim(true); }}>
            <IconButton size='large'>
              <ArrowBack sx={{
                color: '#000000'
              }}
              />
            </IconButton>
          </Link>
        </Grid>
        <Grid
          item sx={{
            marginTop: maxheightMatch ? '0' : '5vh',
            width: maxheightMatch ? '200px' : '300px',
            height: maxheightMatch ? '175px' : '250px'
          }}
        >
          <img src={LoginPasswordImage} width='100%' height='100%' />
        </Grid>
        <Grid item>
          <p style={{
            fontWeight: theme.typography.fontWeightBold,
            fontSize: '5vh',
            textAlign: 'center',
            marginTop: '0',
            marginBottom: '4vh'
          }}
          >Let's you sign up
          </p>
        </Grid>
        <Grid
          container
          direction='column'
          alignItems='center'
          spacing='2vh'
        >
          <Grid item>
            <AppTextField
              label='Your login'
              width='90vw'
              onChange={(e) => { setLogin(e.target.value); }}
              sx={login === ''
                ? {
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'solid 2px red'
                    }
                  }
                : {}}
              disabled={isLoading}
            />
          </Grid>
          <Grid item>
            <AppTextField
              label='Your password'
              width='90vw'
              type={showPassword ? 'text' : 'password'}
              disabled={isLoading}
              sx={password === ''
                ? {
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'solid 2px red'
                    }
                  }
                : {}}
              onChange={(e) => {
                setPassword(e.target.value);
                passwordsMatchingHandler(e.target.value, repeatPassword);
              }}
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
          <Grid item>
            <AppTextField
              label='Repeat password'
              width='90vw'
              disabled={isLoading}
              type={showRepeatPassword ? 'text' : 'password'}
              sx={repeatPassword === ''
                ? {
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'solid 2px red'
                    }
                  }
                : {}}
              onChange={(e) => {
                setRepeatPassword(e.target.value);
                passwordsMatchingHandler(password, e.target.value);
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      onClick={handleRepeatPassword}
                    >
                      {showRepeatPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid
            sx={{
              color: 'red',
              fontSize: '2vh'
            }}
            item
            hidden={arePasswordsMatched}
          >
            <div>Passwords mismatched</div>
          </Grid>
          <Grid
            sx={{
              color: 'red',
              fontSize: '2vh'
            }}
            item
            hidden={isAuthDataCorrect}
          >
            <div>Current login is already in use</div>
          </Grid>
        </Grid>
      </Grid>
      <Grid item sx={{ marginBottom: '5vh' }}>
        <BigBlueButton text='Sign Up' onClick={sendAuthorizationForm} target='/createaccount' />
      </Grid>
    </Grid>
  );
}
