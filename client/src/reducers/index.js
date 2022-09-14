import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import DialogsReducer from './DialogsReducer';
import MessagesReducer from './MessagesReducer';
import UserReducer from './UserReducer.js';
import ContactsReducer from './ContactsReducer';

const rootReducer = combineReducers({
  dialogsReducer: DialogsReducer,
  messagesReducer: MessagesReducer,
  userReducer: UserReducer,
  contactsReducer: ContactsReducer
}
);

export const store = configureStore({ reducer: rootReducer });
