const UserModel = require('../Models/UserModel');
const DialogModel = require('../Models/DialogModel');
const authenticationControl = require('../Middlewares/authenticationControl');
const contactsObserverCreator = require('./contactsObserver');
const dialogsObserverCreator = require('./dialogsObserver');
const messageReadingObserverCreator = require('./messageReadingObserver');
const messageSendingObserverCreator = require('./messageSendingObserver');
const userObserverCreator = require('./userObserver');
const wholeRelatedMessageObserverCreator = require('./wholeRelatedMessagesObserver');
const peerObserverCreator = require('./peerObserver');

async function connectionObserver (socket) {
  const { token } = socket.handshake.auth;

  const login = await authenticationControl(token);

  if (login === null) {
    socket.disconnect();
    return;
  }

  const currentUser = await UserModel.findOne({ login });
  currentUser.isOnline = true;
  await currentUser.save();

  const contactsObserver = contactsObserverCreator(socket);

  const wholeRelatedMessageObserver = await wholeRelatedMessageObserverCreator(socket, login);

  // insuranse for correct exit from dialog when correspondent browser tab was closed by client
  let messageSendingObserver = null;
  let messageReadingObserver = null;
  let dialogid = null;
  let peerObserver = null;

  const exitFromDialog = async (socket) => {
    messageReadingObserver.close();
    messageSendingObserver.close();
    peerObserver.close();
    if (await DialogModel.exists({ _id: dialogid, lastMessage: null })) {
      await DialogModel.deleteOne({ _id: dialogid });
    }
    socket.removeAllListeners('exit from dialog');
    dialogid = null;
  };

  socket.on('dialog was selected', async dialogId => {
    dialogid = dialogId;
    peerObserver = await peerObserverCreator(socket, dialogid, login);
    messageSendingObserver = messageSendingObserverCreator(socket, dialogid);
    messageReadingObserver = messageReadingObserverCreator(socket, dialogid);

    socket.on('exit from dialog', async () => { await exitFromDialog(socket); });
  });

  const userObserver = userObserverCreator(socket, login);

  const dialogsObserver = dialogsObserverCreator(socket, login, wholeRelatedMessageObserver);

  socket.on('disconnect', async () => {
    userObserver.close();
    dialogsObserver.close();
    if (wholeRelatedMessageObserver !== null) wholeRelatedMessageObserver.close();
    contactsObserver.close();
    // insurance in action
    if (dialogid) await exitFromDialog(socket, dialogid);
    currentUser.isOnline = false;
    await currentUser.save();
  });
}

module.exports = connectionObserver;
