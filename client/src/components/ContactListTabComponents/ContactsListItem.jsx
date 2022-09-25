import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useContext } from 'react';
import { useTheme, Grid } from '@mui/material';
import { authentificationContext } from '../../Routes';
import { dialogPageWillMount, dialogPageSelect } from '../../databaseSubscriber';

import Avatar from '@mui/material/Avatar';

export default function ContactsListItem (props) {
  const { user: { token } } = useContext(authentificationContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();

  const handleClick = (e) => {
    fetch('/api/main', {
      mode: 'cors',
      method: 'POST',
      headers: { Authorization: token },
      body: JSON.stringify({
        action: 'startNewDialog',
        peerLogin: props.contact.login
      })
    }).then(response => {
      if (response.status === 200) {
        response.json().then(([doesExist, dialog]) => {
          if (!doesExist) dispatch({ type: 'INSERT_DIALOG', value: dialog });
          dispatch({ type: 'SET_SELECTED_DIALOG', value: dialog._id });
          dialogPageSelect(dialog._id);
          dialogPageWillMount(dialog._id);
          navigate('/dialog');
        });
      }
    });
  };

  const itemPointDownAnimation = `animation-name : chatItemAnimationDown;
  animation-duration : 0.3s;
  background-color : #00dfff`;
  const itemPointUpAnimation = `animation-name : chatItemAnimationUp;
  animation-duration : 0.3s;
  background-color : #ffffff`;

  return (
    <Grid
      container
      direction='row'
      justifyContent='flex-start'
      onClick={props.isStartingNewDialogWindow ? handleClick : () => {}}
      onTouchStart={e => { e.currentTarget.style = itemPointDownAnimation; }}
      onMouseDown={e => { e.currentTarget.style = itemPointDownAnimation; }}
      onTouchEnd={e => { e.currentTarget.style = itemPointUpAnimation; }}
      onMouseUp={e => { e.currentTarget.style = itemPointUpAnimation; }}
      wrap='nowrap'
    >
      <Grid
        item
        sx={{
          position: 'relative'
        }}
      >
        <Avatar
          src={props.contact.profile.avatar}
          sx={{
            bgcolor: 'red',
            width: '50px',
            height: '50px'
          }}
        >OP
        </Avatar>
        <div
          hidden={!props.contact.isOnline}
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
        container
        direction='row'
        justifyContent='space-between'
        wrap='nowrap'
      >
        <Grid
          container
          direction='column'
          justifyContent='space-between'
        >
          <Grid
            item
            sx={{
              paddingLeft: '10px',
              fontWeight: theme.typography.fontWeightExtraBold
            }}
          >{props.contact.profile.nickname}
          </Grid>
          <Grid
            item
            sx={{
              paddingLeft: '10px',
              fontWeight: theme.typography.fontWeightRegular,
              color: '#616161'
            }}
          >{props.contact.profile.fullname}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
