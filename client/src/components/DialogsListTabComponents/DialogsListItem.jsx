import { useSelector } from 'react-redux';
import { useContext } from 'react';
import { useTheme, Grid, Avatar } from '@mui/material';
import Moment from 'react-moment';
import { authentificationContext } from '../../Routes';

export default function DialogsListItem (props) {
  const theme = useTheme();
  const { user: { login } } = useContext(authentificationContext);
  const { isReaded, author, content, date } = useSelector(state => state.dialogsReducer.Dialogs[props.dialogId].lastMessage);
  const unreadedMessagesCount = useSelector(state => state.dialogsReducer.Dialogs[props.dialogId].unreadedMessagesCount);
  const isPeerOnline = useSelector(state => state.contactsReducer.Contacts[props.Login].isOnline);
  const nickname = useSelector(state => state.contactsReducer.Contacts[props.Login].profile.nickname);

  return (
    <Grid
      container
      direction='row'
      justifyContent='flex-start'
      wrap='nowrap'
    >
      <Grid
        item
        sx={{ position: 'relative' }}
      >
        <Avatar
          src={props.src}
          sx={{
            bgcolor: 'red',
            width: '7vh',
            height: '7vh'
          }}
        >OP
        </Avatar>
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
              color: '#000000',
              paddingLeft: '10px',
              fontWeight: theme.typography.fontWeightExtraBold,
              fontSize: '2.5vh'
            }}
          >{nickname}
          </Grid>
          <Grid
            item
            sx={{
              paddingLeft: '5px',
              paddingRight: '5px',
              marginLeft: '10px',
              fontWeight: theme.typography.fontWeightRegular,
              bgcolor: `${!isReaded ? login === author ? theme.palette.secondary.contrastText : 'transparent' : 'transparent'}`,
              borderRadius: '2vw',
              width: 'fit-content',
              color: '#616161'
            }}
          ><span
            hidden={login !== author}
            style={{
              color: '#7300ff'
            }}
          >You:
          </span>{content.length > 20 ? content.slice(0, 20) + '...' : content}
          </Grid>
        </Grid>
        <Grid
          container
          direction='column'
          justifyContent='space-between'
          alignItems='flex-end'
        >
          <Grid item>
            <div
              hidden={unreadedMessagesCount === 0}
              style={{
                paddingTop: '0.3vh',
                backgroundColor: theme.palette.primary.main,
                width: '3vh',
                height: '3vh',
                fontSize: '2vh',
                borderRadius: '50%',
                color: 'white',
                textAlign: 'center'
              }}
            >
              {unreadedMessagesCount}
            </div>
          </Grid>
          <Grid
            item
            sx={{ color: '#616161' }}
          >
            <Moment format='D MMM HH:mm'>{date}</Moment>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
