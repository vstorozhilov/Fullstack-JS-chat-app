import { useTheme, Grid, IconButton, Avatar } from '@mui/material';
import { ArrowBack, Search, DensityMedium } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { mainPageWillMount } from '../../databaseSubscriber';
import CircularProgress from '@mui/material/CircularProgress';

export default function DialogHeader (props) {
  const theme = useTheme();
  const peerAvatar = useSelector(state => state.peerReducer.Peer.profile.avatar);
  const isPeerOnline = useSelector(state => state.peerReducer.Peer.isOnline);
  const peerNickname = useSelector(state => state.peerReducer.Peer.profile.nickname);
  const navigate = useNavigate();

  return (
    <header style={{
      background: 'linear-gradient(to right, #4f89ff, #2d71fd)',
      color: theme.palette.secondary.text,
      minHeight: '60px'
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
            <IconButton
              onClick={() => {
                props.setReverseAnim(true);
                mainPageWillMount();
                navigate('/main');
              }}
              size='large'
              sx={{
                marginLeft: '1vw',
                color: theme.palette.secondary.text
              }}
            >
              <ArrowBack />
            </IconButton>
          </Grid>
          {props.isLoadingUpdates
            ? <CircularProgress size='5vh' thickness={2.0} sx={{ color: '#ffffff' }} />
            : <>
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
                    width: '50px',
                    height: '50px'
                  }}
                />
                <div
                  hidden={!isPeerOnline}
                  style={{
                    height: '13px',
                    position: 'absolute',
                    backgroundColor: '#00ff00',
                    borderRadius: '50%',
                    width: '13px',
                    bottom: '0',
                    left: '40px'
                  }}
                />
              </Grid>
              <Grid
                item
                sx={{
                  fontWeight: theme.typography.fontWeightBold
                }}
              >
                {peerNickname}
              </Grid>
              </>}
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
                  //marginTop: '1rem'
                }} fontSize='large'
              />
            </IconButton>
          </Grid>
          <Grid item>
            <IconButton>
              <DensityMedium
                sx={{
                  color: theme.palette.secondary.text,
                  //marginTop: '1rem'
                }} fontSize='large'
              />
            </IconButton>
          </Grid>
        </Grid>
      </Grid>
    </header>
  );
}
