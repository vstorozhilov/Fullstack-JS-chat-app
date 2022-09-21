import { styled } from '@mui/material/styles';
import SnackbarContent from '@mui/material/SnackbarContent';
import { Grid } from '@mui/material';
import TimeLabel from '../CommonComponents/TimeLabel';
import { animated } from '@react-spring/web';

const MyMessageStyled = styled(SnackbarContent)(({ theme }) => `
    background-color : ${theme.palette.primary.light};
    border-radius : 10px;
    min-width: fit-content;
    box-shadow: none;
    word-break: break-all;
    flex-direction: column;
    flex-wrap: nowrap;
`);

export default function MyMessage (props) {
  return (
    <Grid
      item
      alignSelf='end'
      paddingRight='3vw'
    >
      <animated.div style={props.styles}>
        <Grid
          container
          flexDirection='row'
          justifyContent='center'
          alignItems='center'
          flexWrap='nowrap'
          gap='2vw'
        >
          <Grid item>
            <div
              hidden={props.isReaded} style={{
                backgroundColor: 'blue',
                borderRadius: '50%',
                width: '10px',
                height: '10px'
              }}
            />
          </Grid>
          <Grid item>
            <MyMessageStyled
              message={props.message}
              action={<TimeLabel date={props.date} />}
            />
          </Grid>
        </Grid>
      </animated.div>
    </Grid>
  );
}
