const mongoose = require('mongoose');
const UserModel = require('../models/userModel');
const DialogModel = require('../models/dialogModel');
const MessageModel = require('../models/messageModel');
const authenticationControl = require('../Middlewares/authenticationControl');

function contactsObserverStreamCreator (socket) {
  const contactsChangeStream = UserModel.watch([
  ], { fullDocument: 'updateLookup' });

  contactsChangeStream.on('change', async __ => {
    const actualContacts = await UserModel.find();
    socket.emit('contacts changed', actualContacts);
  });

  return contactsChangeStream;
}

async function wholeRelatedMessageObserverStreamCreator (socket, login) {
  const dialogs = (await DialogModel.find({
    $match:
      {
        $or:
      [{ peerOne: login },
        { peerTwo: login }]
      }
  }, { _id: 1 })).map(item => item._id);

  if (dialogs.length !== 0) {
    const wholeRelatedMessageChangeStream = MessageModel.watch([{
      $match: {
        $or: dialogs.map(item => ({ 'fullDocument.dialog': item }))
      }
    }], { fullDocument: 'updateLookup' });

    wholeRelatedMessageChangeStream.on('change', async data => {
      const dialog = await DialogModel.findOne({ _id: data.fullDocument.dialog });
      if (data.operationType === 'update' &&
                    dialog.lastMessage.equals(data.documentKey._id) &&
                    data.fullDocument.author === login) {
        socket.emit('last message was readed', [data.fullDocument.dialog, data.fullDocument.isReaded]);
      }
      const unreadedMessagesCount = (await MessageModel.find({
        author: { $ne: login },
        isReaded: false,
        dialog: data.fullDocument.dialog
      })).length;

      socket.emit('unreaded messages count was changed',
        [unreadedMessagesCount, data.fullDocument.dialog]);
    });
    return wholeRelatedMessageChangeStream;
  } else {
    return null;
  }
}

function messageSendingObserverStreamCreator (socket, dialogId) {
  const messageSendingObserverStream = MessageModel.watch([
    { $match: { $and: [{ operationType: 'insert' }, { 'fullDocument.dialog': mongoose.Types.ObjectId(dialogId) }] } },
    { $project: { fullDocument: 1 } }
  ],
  { fullDocument: 'updateLookup' });

  messageSendingObserverStream.on('change', data => {
    console.log('message sended');
    socket.emit('message sended', data.fullDocument);
  });

  return messageSendingObserverStream;
}

function messageReadingObserverStreamCreator (socket, dialogId) {
  const messageReadingObserverStream = MessageModel.watch([
    { $match: { 'fullDocument.dialog': mongoose.Types.ObjectId(dialogId) } },
    {
      $addFields: {
        tmpfields: { $objectToArray: '$updateDescription.updatedFields' }
      }
    },
    { $match: { 'tmpfields.k': { $eq: 'isReaded' } } },
    { $project: { documentKey: 1 } }],
  { fullDocument: 'updateLookup' });

  messageReadingObserverStream.on('change', data => {
    socket.emit('message was readed', data.documentKey._id);
  });

  return messageReadingObserverStream;
}

function userObserverStreamCreator (socket, login) {
  const userObserverStream = UserModel.watch([{ $match: { 'fullDocument.login': login } },
    { $project: { fullDocument: 1 } }],
  { fullDocument: 'updateLookup' });

  userObserverStream.on('change', data => {
    socket.emit('user changed', data.fullDocument);
  });

  return userObserverStream;
}

function dialogsObserverStreamCreator (socket, login, wholeRelatedMessageChangeStream) {
  const dialogsObserverStream = DialogModel.watch([
    {
      $match:
        {
          $or: [
            { 'fullDocument.peerOne': login },
            { 'fullDocument.peerTwo': login },
            { operationType: 'delete' }
          ]
        }
    }
  ],
  { fullDocument: 'updateLookup' });

  dialogsObserverStream.on('change', async data => {
    const actualDialogs = await DialogModel.find({
      $or: [{ peerOne: login },
        { peerTwo: login }]
    });

    const promises = actualDialogs.filter(item => (item.lastMessage !== null)).map(async item => {
      await item.populate('lastMessage');
      item.unreadedMessagesCount = (await MessageModel.find({
        author: { $ne: login },
        isReaded: false,
        dialog: item._id
      })).length;
    });

    await Promise.all(promises);

    if (data.operationType !== 'insert' ||
                    (data.operationType === 'insert' &&
                    data.fullDocument.peerOne !== login)) {
      socket.emit('dialogs changed', actualDialogs);
    }

    if (data.operationType === 'insert') {
      if (wholeRelatedMessageChangeStream !== null) wholeRelatedMessageChangeStream.close();

      wholeRelatedMessageChangeStream = wholeRelatedMessageObserverStreamCreator(socket, login);
    }
  });

  return dialogsObserverStream;
}

async function connectionHandler (socket) {
  console.log('connected to socketio');

  const { token } = socket.handshake.auth;

  const login = await authenticationControl(token);

  if (login === null) {
    socket.disconnect();
    return;
  }

  const currentUser = await UserModel.findOne({ login });
  currentUser.isOnline = true;
  await currentUser.save();

  const contactsObserver = contactsObserverStreamCreator(socket);

  const wholeRelatedMessageObserver = await wholeRelatedMessageObserverStreamCreator(socket, login);

  socket.on('dialog has selected', dialogId => {
    const messageSendingObserver = messageSendingObserverStreamCreator(socket, dialogId);
    const messageReadingObserver = messageReadingObserverStreamCreator(socket, dialogId);

    socket.on('exit from dialog', async () => {
      messageReadingObserver.close();
      messageSendingObserver.close();
      if (await DialogModel.exists({ _id: dialogId, lastMessage: null })) {
        await DialogModel.deleteOne({ _id: dialogId });
      }
      socket.removeAllListeners('exit from dialog');
    });
  });

  const userObserverStream = userObserverStreamCreator(socket, login);
  
  const dialogsObserverStream = dialogsObserverStreamCreator(socket, login, wholeRelatedMessageObserver);

  socket.on('disconnect', async () => {
    userObserverStream.close();
    dialogsObserverStream.close();
    if (wholeRelatedMessageObserver !== null) wholeRelatedMessageObserver.close();
    contactsObserver.close();
    currentUser.isOnline = false;
    currentUser.save();
    console.log('connection closed');
  });
}

module.exports = connectionHandler;