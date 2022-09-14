import React from 'react';
import greetImage from '../images/1.jpg';
import { useTheme, Grid, useMediaQuery } from '@mui/material';
import { BigBlueButton } from '../components/CommonComponents/BigBlueButton';
import { useNavigate } from 'react-router-dom';

export default function Greet (props) {
  const maxWidthMatch = useMediaQuery('(max-width: 350px)');
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Grid
      container
      flexWrap='nowrap'
      alignItems='center'
      direction='column'
      justifyContent='space-between'
      height='100%'
      sx={{
        overflowY: 'scroll'
      }}
    >
      <Grid container alignItems='center' direction='column'>
        <Grid
          item sx={{
            paddingTop: '5vh',
            width: `${maxWidthMatch ? '100%' : '350px'}`,
            borderRadius: '50%',
            overflow: 'hidden'
          }}
        >
          <img width='100%' height='100%' src={greetImage} />
        </Grid>
        <Grid item>
          <p style={{
            fontWeight: theme.typography.fontWeightBold,
            fontSize: '4vh',
            lineHeight: '3vh',
            textAlign: 'center',
            color: theme.palette.secondary.main
          }}
          >Welcome to my Chat!
          </p>
        </Grid>
        <Grid item>
          <p style={{
            marginTop: 0,
            lineHeight: '3vh',
            fontWeight: theme.typography.fontWeightLight,
            textAlign: 'center'
          }}
          >
            The best messenger and chat app of the<br />
            century to make your day great
          </p>
        </Grid>

      </Grid>
      <Grid item>
        <BigBlueButton
          onClick={() => navigate('/login')}
          text='Get Started'
          sx={{ marginBottom: '5.5vh' }}
        />
      </Grid>
    </Grid>
  );
}
