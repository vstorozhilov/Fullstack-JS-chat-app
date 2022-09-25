import { io } from 'socket.io-client';
import { store } from './reducers/index';
import MessagesReducer from './reducers/MessagesReducer';
import DialogsReducer from './reducers/DialogsReducer';
import UserReducer from './reducers/UserReducer';
import PeerReducer from './reducers/PeerReducer';
import ContactsReducer from './reducers/ContactsReducer';
import dialogPageSubscribers from './ComponentsSubscribers/DialogPageSubscribers';
import mainPageSubscribers from './ComponentsSubscribers/MainPageSubscribers';
import serverdata from './serverConf';

let socket;

function connectToDatabase (token) {
  socket = io(`http://${serverdata.serverhost}:${serverdata.serverport}`, { auth: { token } });
}

function disconnectFromDatabase () {
  socket.disconnect();
}

function mainPageRefreshSubscribers () {
  socket.removeAllListeners();
  mainPageSubscribers(socket);
}

function mainPageWillUnmount () {
  store.reducerManager.remove('dialogsReducer');
  store.reducerManager.remove('contactsReducer');
  store.reducerManager.remove('userReducer');
  store.dispatch({ type: 'COMPONENT_DESTROYED' });
}

function mainPageWillMount () {
  store.reducerManager.add('dialogsReducer', DialogsReducer);
  store.reducerManager.add('contactsReducer', ContactsReducer);
  store.reducerManager.add('userReducer', UserReducer);
  store.dispatch({ type: 'INIT' });
}

function dialogPageWillUnmount () {
  store.reducerManager.remove('messagesReducer');
  store.reducerManager.remove('peerReducer');
  store.dispatch({ type: 'COMPONENT_DESTROYED' });
  if (socket) socket.emit('exit from dialog');
}

function dialogPageWillMount (dialogId) {
  socket.removeAllListeners();
  store.reducerManager.add('messagesReducer', MessagesReducer);
  store.reducerManager.add('peerReducer', PeerReducer);
  store.dispatch({ type: 'INIT' });
  dialogPageSubscribers(socket);
}

function dialogPageSelect (dialogId) {
  socket.emit('dialog was selected', dialogId);
}

export { connectToDatabase, disconnectFromDatabase, mainPageRefreshSubscribers, mainPageWillMount, mainPageWillUnmount, dialogPageSelect, dialogPageWillMount, dialogPageWillUnmount };
