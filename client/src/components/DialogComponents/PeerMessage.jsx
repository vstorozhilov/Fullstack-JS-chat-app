import { styled } from '@mui/material/styles';
import SnackbarContent from '@mui/material/SnackbarContent';
import { animated } from '@react-spring/web';
import { Grid } from '@mui/material';
import React from 'react';
import TimeLabel from '../CommonComponents/TimeLabel';

const PeerMessageStyled = styled(SnackbarContent)(({ theme }) => `
    background-color : ${theme.palette.secondary.contrastText};
    border-radius : 3vmin;
    color: black;
    min-width: fit-content;
    box-shadow: none;
    word-break: break-all;
    flex-direction: column;
    flex-wrap: nowrap;
`);

function PeerMessage (props) {
  return (
    <Grid
      item
      alignSelf='start'
      marginLeft='3vw'
    >
      <animated.div style={props.styles}>
        <PeerMessageStyled
          message={props.message}
          action={<TimeLabel date={props.date} />}
        />
      </animated.div>
    </Grid>
  );
}

const RefPeerMessage = React.forwardRef((props, ref) => {
  return (
    <Grid
      item
      ref={ref}
      alignSelf='start'
      marginLeft='3vw'
    >
      <animated.div style={props.styles}>
        <Grid
          container
          flexDirection='row'
          justifyContent='center'
          alignItems='center'
          gap='2vw'
        >
          <Grid item>
            <PeerMessageStyled
              message={props.message}
              action={<TimeLabel date={props.date} />}
            />
          </Grid>
          <Grid item>
            <div style={{
              backgroundColor: 'blue',
              borderRadius: '50%',
              width: '10px',
              height: '10px'
            }}
            />
          </Grid>
        </Grid>
      </animated.div>
    </Grid>
  );
});

export { RefPeerMessage, PeerMessage };
