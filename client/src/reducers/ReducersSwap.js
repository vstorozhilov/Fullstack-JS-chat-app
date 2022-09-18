import MessagesReducer from './MessagesReducer';
import ContactsReducer from './ContactsReducer';
import DialogsReducer from './DialogsReducer';
import UserReducer from './UserReducer';
import SelectDialogReducer from './SelectDialogReducer';
import { combineReducers } from 'redux';

export function configureDialogPageStore (store, peerContact) {
  const DialogsPageReducers = combineReducers({
    messagesReducer: MessagesReducer,
    contactsReducer: ContactsReducer,
    selectDialogReducer: SelectDialogReducer
  });

  store.replaceReducer(DialogsPageReducers);
  store.dispatch({ type: 'SET_CONTACTS',
  value: [store.contactsReducer.Contacts[peerContact]] });
}

export function configureMainPageStore (store) {
  const MainPageReducers = combineReducers({
    contactsReducer: ContactsReducer,
    dialogsReducer: DialogsReducer,
    userReducer: UserReducer,
    selectDialogReducer: SelectDialogReducer
  });

  store.replaceReducer(MainPageReducers);
}
