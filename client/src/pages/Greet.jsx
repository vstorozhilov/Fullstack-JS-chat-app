import React from 'react';
import greetImage from '../images/1.jpg';
import { useTheme, Grid } from '@mui/material';
import { BigBlueButton } from '../components/CommonComponents/BigBlueButton';
import { useNavigate } from 'react-router-dom';

export default function Greet (props) {
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
    >
      <Grid
        container
        alignItems='center'
        direction='column'
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
          item sx={{
            paddingTop: '5vh',
            borderRadius: '50%',
            overflow: 'hidden'
          }}
        >
          <img width='350px' src={greetImage} alt='' />
        </Grid>
        <Grid item>
          <p style={{
            fontWeight: theme.typography.fontWeightBold,
            fontSize: '1.5rem',
            textAlign: 'center',
            color: theme.palette.secondary.main
          }}
          >Welcome to my Chat!
          </p>
        </Grid>
        <Grid item>
          <p style={{
            marginTop: 0,
            fontWeight: theme.typography.fontWeightLight,
            textAlign: 'center'
          }}
          >
            The best messenger and chat app of the<br />
            century to make your day great
          </p>
        </Grid>

      </Grid>
      <Grid
        container
        justifyContent='center'
        sx={{
          [theme.breakpoints.up('tablet')]: {
            width: '600px'
          },
          [theme.breakpoints.down('tablet')]: {
            width: '100%'
          }
        }}
      >
        <BigBlueButton
          onClick={() => navigate('/login')}
          text='Get Started'
          sx={{ marginBottom: '5.5vh', width: '90%' }}
        />
      </Grid>
    </Grid>
  );
}
