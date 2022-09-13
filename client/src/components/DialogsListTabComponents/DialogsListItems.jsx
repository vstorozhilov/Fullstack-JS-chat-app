import '../../App.css';
import React, { useContext } from 'react';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { authentificationContext } from '../../Routes';
import { dialogIsSelected } from '../../databaseSubscriber';
import { zip } from 'zip-array';
import DialogListItem from './DialogsListItem';
import NoDialogsYet from './noDialogsYet';

function DialogListItemContainer ({ style, id, onClick, ...props }) {
  const itemPointDownAnimation = `animation-name : chatItemAnimationDown;
    animation-duration : 0.3s;
    background-color : #00dfff;`;
  const itemPointUpAnimation = `animation-name : chatItemAnimationUp;
    animation-duration : 0.3s;
    background-color : #ffffff;`;

  return (
    <Grid
      item onClick={onClick} id={id} sx={style}
      onTouchStart={e => { e.currentTarget.style = itemPointDownAnimation; }}
      onMouseDown={e => { e.currentTarget.style = itemPointDownAnimation; }}
      onTouchEnd={e => { e.currentTarget.style = itemPointUpAnimation; }}
      onMouseUp={e => { e.currentTarget.style = itemPointUpAnimation; }}
    >
      <DialogListItem {...props} dialogId={id} />
    </Grid>
  );
}

export default function DialogsListItems (props) {
  const dispatch = useDispatch();
  console.log('rendered');

  const navigate = useNavigate();

  const dialogs = useSelector(state => Object.values(state.dialogsReducer.Dialogs).filter(item => (item.lastMessage !== null)));
  const contacts = useSelector(state => state.contactsReducer.Contacts);

  const { user: { login } } = useContext(authentificationContext);

  const avatars = dialogs.map(item => {
    const peerLogin = (login === item.peerOne ? item.peerTwo : item.peerOne);
    return contacts[peerLogin].profile.avatar;
  });

  const dialogAvaPair = zip(dialogs, avatars);

  const handleClick = (e) => {
    dispatch({ type: 'SET_SELECTED_DIALOG', value: e.currentTarget.id });
    dialogIsSelected(e.currentTarget.id);
    navigate('/dialog');
  };

  const compareDatesFunction = (dateOne, dateTwo) => {
    const DateOne = new Date(dateOne);
    const DateTwo = new Date(dateTwo);

    return -1 * (DateOne - DateTwo);
  };

  return (
    <Grid
      container
      direction='column'
      justifyContent='flex-start'
      rowSpacing={3}
      height='100%'
    >
      {dialogs.length
        ? dialogAvaPair.filter(item => (item[0].lastMessage !== null))
          .sort((itemOne, itemTwo) =>
            compareDatesFunction(itemOne[0].lastMessage.date, itemTwo[0].lastMessage.date))
          .map((item, index) => {
            return (
              <DialogListItemContainer
                key={index}
                id={item[0]._id}
                src={item[1]}
                onClick={handleClick}
                Login={login === item[0].peerOne ? item[0].peerTwo : item[0].peerOne}
              />
            )
            ;
          })
        : <NoDialogsYet />}
    </Grid>
  );
}
