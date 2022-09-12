const UserModel = require('../models/userModel');
const DialogModel = require('../models/dialogModel');
const authenticationControl = require('../Middlewares/authenticationControl');
const contactsObserverCreator = require('./contactsObserver');
const dialogsObserverCreator = require('./dialogsObserver');
const messageReadingObserverCreator = require('./messageReadingObserver');
const messageSendingObserverCreator = require('./messageSendingObserver');
const userObserverCreator = require('./userObserver');
const wholeRelatedMessageObserverCreator = require('./wholeRelatedMessagesObserver');

// function contactsObserverCreator (socket) {
//   const contactsObserver = UserModel.watch([
//   ], { fullDocument: 'updateLookup' });

//   contactsObserver.on('change', async __ => {
//     const actualContacts = await UserModel.find();
//     socket.emit('contacts changed', actualContacts);
//   });

//   return contactsObserver;
// }

// async function wholeRelatedMessageObserverCreator (socket, login) {
//   const dialogs = (await DialogModel.find({
//     $match:
//       {
//         $or:
//       [{ peerOne: login },
//         { peerTwo: login }]
//       }
//   }, { _id: 1 })).map(item => item._id);

//   if (dialogs.length !== 0) {
//     const wholeRelatedMessageObserver = MessageModel.watch([{
//       $match: {
//         $or: dialogs.map(item => ({ 'fullDocument.dialog': item }))
//       }
//     }], { fullDocument: 'updateLookup' });

//     wholeRelatedMessageObserver.on('change', async data => {
//       const dialog = await DialogModel.findOne({ _id: data.fullDocument.dialog });
//       if (data.operationType === 'update' &&
//                     dialog.lastMessage.equals(data.documentKey._id) &&
//                     data.fullDocument.author === login) {
//         socket.emit('last message was readed', [data.fullDocument.dialog, data.fullDocument.isReaded]);
//       }
//       const unreadedMessagesCount = (await MessageModel.find({
//         author: { $ne: login },
//         isReaded: false,
//         dialog: data.fullDocument.dialog
//       })).length;

//       socket.emit('unreaded messages count was changed',
//         [unreadedMessagesCount, data.fullDocument.dialog]);
//     });
//     return wholeRelatedMessageObserver;
//   } else {
//     return null;
//   }
// }

// function messageSendingObserverCreator (socket, dialogId) {
//   const messageSendingObserver = MessageModel.watch([
//     { $match: { $and: [{ operationType: 'insert' }, { 'fullDocument.dialog': mongoose.Types.ObjectId(dialogId) }] } },
//     { $project: { fullDocument: 1 } }
//   ],
//   { fullDocument: 'updateLookup' });

//   messageSendingObserver.on('change', data => {
//     console.log('message sended');
//     socket.emit('message sended', data.fullDocument);
//   });

//   return messageSendingObserver;
// }

// function messageReadingObserverCreator (socket, dialogId) {
//   const messageReadingObserver = MessageModel.watch([
//     { $match: { 'fullDocument.dialog': mongoose.Types.ObjectId(dialogId) } },
//     {
//       $addFields: {
//         tmpfields: { $objectToArray: '$updateDescription.updatedFields' }
//       }
//     },
//     { $match: { 'tmpfields.k': { $eq: 'isReaded' } } },
//     { $project: { documentKey: 1 } }],
//   { fullDocument: 'updateLookup' });

//   messageReadingObserver.on('change', data => {
//     socket.emit('message was readed', data.documentKey._id);
//   });

//   return messageReadingObserver;
// }

// function userObserverCreator (socket, login) {
//   const userObserver = UserModel.watch([{ $match: { 'fullDocument.login': login } },
//     { $project: { fullDocument: 1 } }],
//   { fullDocument: 'updateLookup' });

//   userObserver.on('change', data => {
//     socket.emit('user changed', data.fullDocument);
//   });

//   return userObserver;
// }

// function dialogsObserverCreator (socket, login, wholeRelatedMessageObserver) {
//   const dialogsObserver = DialogModel.watch([
//     {
//       $match:
//         {
//           $or: [
//             { 'fullDocument.peerOne': login },
//             { 'fullDocument.peerTwo': login },
//             { operationType: 'delete' }
//           ]
//         }
//     }
//   ],
//   { fullDocument: 'updateLookup' });

//   dialogsObserver.on('change', async data => {
//     const actualDialogs = await DialogModel.find({
//       $or: [{ peerOne: login },
//         { peerTwo: login }]
//     });

//     const promises = actualDialogs.filter(item => (item.lastMessage !== null)).map(async item => {
//       await item.populate('lastMessage');
//       item.unreadedMessagesCount = (await MessageModel.find({
//         author: { $ne: login },
//         isReaded: false,
//         dialog: item._id
//       })).length;
//     });

//     await Promise.all(promises);

//     if (data.operationType !== 'insert' ||
//                     (data.operationType === 'insert' &&
//                     data.fullDocument.peerOne !== login)) {
//       socket.emit('dialogs changed', actualDialogs);
//     }

//     if (data.operationType === 'insert') {
//       if (wholeRelatedMessageObserver !== null) wholeRelatedMessageObserver.close();

//       wholeRelatedMessageObserver = wholeRelatedMessageObserverCreator(socket, login);
//     }
//   });

//   return dialogsObserver;
// }

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

  const contactsObserver = contactsObserverCreator(socket);

  const wholeRelatedMessageObserver = await wholeRelatedMessageObserverCreator(socket, login);

  socket.on('dialog has selected', dialogId => {
    const messageSendingObserver = messageSendingObserverCreator(socket, dialogId);
    const messageReadingObserver = messageReadingObserverCreator(socket, dialogId);

    socket.on('exit from dialog', async () => {
      messageReadingObserver.close();
      messageSendingObserver.close();
      if (await DialogModel.exists({ _id: dialogId, lastMessage: null })) {
        await DialogModel.deleteOne({ _id: dialogId });
      }
      socket.removeAllListeners('exit from dialog');
    });
  });

  const userObserver = userObserverCreator(socket, login);

  const dialogsObserver = dialogsObserverCreator(socket, login, wholeRelatedMessageObserver);

  socket.on('disconnect', async () => {
    userObserver.close();
    dialogsObserver.close();
    if (wholeRelatedMessageObserver !== null) wholeRelatedMessageObserver.close();
    contactsObserver.close();
    currentUser.isOnline = false;
    currentUser.save();
    console.log('connection closed');
  });
}

module.exports = connectionHandler;
