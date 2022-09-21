import { useContext } from 'react';
import authentificationContext from '../../contexts/authentificationContext';
import { useSelector } from 'react-redux';
import { Grid } from '@mui/material';
import ContactListItem from './ContactsListItem';

export default function ContactsListItems (props) {
  const contacts = useSelector(state => Object.values(state.contactsReducer.Contacts));
  const { user: { login } } = useContext(authentificationContext);

  return (
    <Grid
      container
      direction='column'
      justifyContent='flex-start'
      rowSpacing={2}
      flexGrow='1'
      sx={{
        paddingLeft: `${props.isStartingNewDialogWindow ? '3vw' : '0'}`
      }}
      overflowy='scroll'
    >
      {contacts.map((value, index) => {
        if (value.login !== login) {
          return (
            <Grid item key={index}>
              <ContactListItem isStartingNewDialogWindow={props.isStartingNewDialogWindow} contact={value} />
            </Grid>
          )
          ;
        }
      })}
    </Grid>
  );
}
