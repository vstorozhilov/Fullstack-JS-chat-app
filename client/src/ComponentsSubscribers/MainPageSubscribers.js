import { store } from '../reducers';

export default function mainPageSubscribers (socket) {
  socket.on('user changed', data => {
    console.log(data);
    store.dispatch({ type: 'SET_USER', value: data });
  });

  socket.on('contacts changed', data => {
    console.log(data);
    store.dispatch({ type: 'SET_CONTACTS', value: data });
  });

  socket.on('dialogs changed', data => {
    console.log(data);
    store.dispatch({ type: 'SET_DIALOGS', value: data });
  });

  socket.on('unreaded messages count was changed', data => {
    console.log(data[0]);
    store.dispatch({ type: 'SET_UNREADEDMESSAGESCOUNT', value: data });
  });

  socket.on('last message was readed', data => {
    store.dispatch({ type: 'SET_LASTMESSAGEWASREADED', value: data });
  });
}
