import { useTheme, Grid, IconButton, Avatar } from '@mui/material';
import { ArrowBack, Search, DensityMedium } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export default function DialogHeader (props) {
  const theme = useTheme();
  const peerAvatar = useSelector(state => state.contactsReducer.Contacts[props.peerLogin].profile.avatar);
  const isPeerOnline = useSelector(state => state.contactsReducer.Contacts[props.peerLogin].isOnline);
  const peerNickname = useSelector(state => state.contactsReducer.Contacts[props.peerLogin].profile.nickname);

  return (
    <header style={{
      background: 'linear-gradient(to right, #4f89ff, #2d71fd)',
      color: theme.palette.secondary.text,
      minHeight: '10vh'
    }}
    >
      <Grid
        container
        width='100%'
        height='100%'
        direction='row'
        justifyContent='space-between'
        flexWrap='nowrap'
      >
        <Grid
          container
          width='fit-content'
          alignItems='center'
          flexWrap='nowrap'
        >
          <Grid item>
            <Link to='/main' onClick={() => { props.setReverseAnim(true); }}>
              <IconButton
                size='large'
                sx={{
                  marginLeft: '1vw',
                  color: theme.palette.secondary.text
                }}
              >
                <ArrowBack />
              </IconButton>
            </Link>
          </Grid>
          <Grid
            item sx={{
              paddingRight: '2vw',
              position: 'relative'
            }}
          >
            <Avatar
              src={peerAvatar}
              sx={{
                bgcolor: 'red',
                width: '7vh',
                height: '7vh'
              }}
            />
            <div
              hidden={!isPeerOnline}
              style={{
                heigth: '2vh',
                position: 'absolute',
                backgroundColor: '#00ff00',
                borderRadius: '50%',
                width: '2vh',
                height: '2vh',
                bottom: '0',
                left: '5vh'
              }}
            />
          </Grid>
          <Grid
            item
            sx={{
              fontWeight: '600',
              fontSize: '2.5vh'
            }}
          >
            {peerNickname}
          </Grid>
        </Grid>
        <Grid
          container
          width='fit-content'
          alignItems='center'
        >
          <Grid item>
            <IconButton>
              <Search
                sx={{
                  color: theme.palette.secondary.text,
                  marginTop: '1vh'
                }} fontSize='large'
              />
            </IconButton>
          </Grid>
          <Grid item>
            <IconButton>
              <DensityMedium
                sx={{
                  color: theme.palette.secondary.text,
                  marginTop: '1vh'
                }} fontSize='large'
              />
            </IconButton>
          </Grid>
        </Grid>
      </Grid>
    </header>
  );
}