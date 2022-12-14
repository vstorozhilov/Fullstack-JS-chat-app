import { store } from '../reducers';

export default function dialogPageSubscribers (socket) {
  socket.on('peer has been changed', data => {
    store.dispatch({ type: 'SET_PEER', value: data });
  });

  socket.on('message sended', data => {
    store.dispatch({ type: 'ADD_MESSAGE', value: data });
  });

  socket.on('message was readed', data => {
    store.dispatch({ type: 'SET_ISREADED', value: data });
  });
}
