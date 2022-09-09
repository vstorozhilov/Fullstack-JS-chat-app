const http = require('http');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const UserModel = require('./models/userModel');
const DialogModel = require('./models/dialogModel');
const MessageModel = require('./models/messageModel');
const authenticationControl = require('./Middlewares/authenticationControl');
const mainTabHandler = require('./Controllers/mainTabControllers');
const { accountCreationHandler, signupHandler } = require('./Controllers/signupControllers');
const messageHandler = require('./Controllers/dialogControllers');
const authenticationHandler = require('./Controllers/authenticationControllers');
const connectionHandler = require('./RealtimeControllers/connectionCotrollers');

async function run () {
  try {
    await mongoose.connect('mongodb://localhost:27017/backendDraft');
    const httpserver = http.createServer(async (req, res) => {
      try {
        if (req.method === 'OPTIONS') {
          res.writeHead(200, headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'authorization',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
          });
          res.end();
        } else {
          switch (req.url) {
            case ('/login') :
              await authenticationHandler(req, res);
              break;
            case ('/loginpassword') :
              await signupHandler(req, res);
              break;
            case ('/signup') :
              await accountCreationHandler(req, res);
              break;
            case ('/main') :
              await mainTabHandler(req, res);
              break;
            case ('/dialog') :
              await messageHandler(req, res);
              break;
          }
        }
      } catch (internalError) {
        res.writeHead(500, headers = {
          'Access-Control-Allow-Origin': '*'
        });
        res.write(internalError.message);
      }
    });
    httpserver.listen(8090);

    const socketioserver = new Server(httpserver, { cors: true });

    // socketioserver.on('connection', async socket => {
    //   console.log('connected to socketio');

    //   const { token } = socket.handshake.auth;

    //   const login = await authenticationControl(token, UserModel);

    //   if (login === null) {
    //     socket.disconnect();
    //     return;
    //   }

    //   const contactsChangeStream = UserModel.watch([
    //   ], { fullDocument: 'updateLookup' });

    //   contactsChangeStream.on('change', async __ => {
    //     console.log('contacts changed');
    //     const actualContacts = await UserModel.find();
    //     socket.emit('contacts changed', actualContacts);
    //   });

    //   const currentUser = await UserModel.findOne({ login });
    //   currentUser.isOnline = true;
    //   await currentUser.save();

    //   let dialogs = (await DialogModel.find({
    //     $match:
    //                 {
    //                   $or:
    //                 [{ peerOne: login },
    //                   { peerTwo: login }]
    //                 }
    //   }, { _id: 1 })).map(item => item._id);

    //   let wholeRelatedMessageChangeStream = null;

    //   if (dialogs.length !== 0) {
    //     wholeRelatedMessageChangeStream = MessageModel.watch([{
    //       $match: {
    //         $or:
    //                     dialogs.map(item => ({ 'fullDocument.dialog': item }))
    //       }
    //     }], { fullDocument: 'updateLookup' });

    //     wholeRelatedMessageChangeStream.on('change', async data => {
    //       console.log('Changggged');
    //       const dialog = await DialogModel.findOne({ _id: data.fullDocument.dialog });
    //       if (data.operationType === 'update' &&
    //                 dialog.lastMessage.equals(data.documentKey._id) &&
    //                 data.fullDocument.author === login) {
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
    //   }

    //   socket.on('dialog has selected', dialogId => {
    //     console.log('selected');

    //     console.log(typeof dialogId);

    //     const messageSendedChangeStream = MessageModel.watch([
    //       { $match: { $and: [{ operationType: 'insert' }, { 'fullDocument.dialog': mongoose.Types.ObjectId(dialogId) }] } },
    //       { $project: { fullDocument: 1 } }
    //     ],
    //     { fullDocument: 'updateLookup' });

    //     const messageReadedChangeStream = MessageModel.watch([
    //       { $match: { 'fullDocument.dialog': mongoose.Types.ObjectId(dialogId) } },
    //       {
    //         $addFields: {
    //           tmpfields: { $objectToArray: '$updateDescription.updatedFields' }
    //         }
    //       },
    //       { $match: { 'tmpfields.k': { $eq: 'isReaded' } } },
    //       { $project: { documentKey: 1 } }],
    //     { fullDocument: 'updateLookup' });

    //     messageSendedChangeStream.on('change', data => {
    //       console.log('message sended');
    //       socket.emit('message sended', data.fullDocument);
    //     });

    //     messageReadedChangeStream.on('change', data => {
    //       socket.emit('message was readed', data.documentKey._id);
    //     });

    //     socket.on('exit from dialog', async () => {
    //       messageReadedChangeStream.close();
    //       messageSendedChangeStream.close();
    //       if (await DialogModel.exists({ _id: dialogId, lastMessage: null })) {
    //         await DialogModel.deleteOne({ _id: dialogId });
    //       }
    //       socket.removeAllListeners('exit from dialog');
    //     });
    //   });

    //   const userChangeStream = UserModel.watch([{ $match: { 'fullDocument.login': login } },
    //     { $project: { fullDocument: 1 } }],
    //   { fullDocument: 'updateLookup' });

    //   userChangeStream.on('change', data => {
    //     socket.emit('user changed', data.fullDocument);
    //   });

    //   const dialogsChangeStream = DialogModel.watch([
    //     {
    //       $match:
    //             {
    //               $or: [
    //                 { 'fullDocument.peerOne': login },
    //                 { 'fullDocument.peerTwo': login },
    //                 { operationType: 'delete' }
    //               ]
    //             }
    //     }
    //   ],
    //   { fullDocument: 'updateLookup' });

    //   dialogsChangeStream.on('change', async data => {
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
    //     console.log('dialog changed');
    //     await Promise.all(promises);

    //     if (data.operationType !== 'insert' ||
    //                 (data.operationType === 'insert' &&
    //                 data.fullDocument.peerOne !== login)) {
    //       socket.emit('dialogs changed', actualDialogs);
    //     }

    //     if (data.operationType === 'insert') {
    //       if (wholeRelatedMessageChangeStream !== null) wholeRelatedMessageChangeStream.close();

    //       dialogs = (await DialogModel.find({
    //         $match:
    //                         {
    //                           $or:
    //                         [{ peerOne: login },
    //                           { peerTwo: login }]
    //                         }
    //       }, { _id: 1 })).map(item => item._id);

    //       wholeRelatedMessageChangeStream = MessageModel.watch([{
    //         $match: {
    //           $or:
    //                         dialogs.map(item => ({ 'fullDocument.dialog': item }))
    //         }
    //       }], { fullDocument: 'updateLookup' });

    //       wholeRelatedMessageChangeStream.on('change', async data => {
    //         console.log('Changggged');
    //         const dialog = await DialogModel.findOne({ _id: data.fullDocument.dialog });
    //         if (data.operationType === 'update' &&
    //                     dialog.lastMessage.equals(data.documentKey._id) &&
    //                     data.fullDocument.author === login) {
    //           socket.emit('last message was readed', [data.fullDocument.dialog, data.fullDocument.isReaded]);
    //         }
    //         const unreadedMessagesCount = (await MessageModel.find({
    //           author: { $ne: login },
    //           isReaded: false,
    //           dialog: data.fullDocument.dialog
    //         })).length;

    //         socket.emit('unreaded messages count was changed',
    //           [unreadedMessagesCount, data.fullDocument.dialog]);
    //       });
    //     }
    //   });

    //   socket.on('disconnect', async () => {
    //     userChangeStream.close();
    //     dialogsChangeStream.close();
    //     if (dialogs.length !== 0) wholeRelatedMessageChangeStream.close();
    //     contactsChangeStream.close();
    //     currentUser.isOnline = false;
    //     currentUser.save();
    //     console.log('connection closed');
    //   });
    // });
    socketioserver.on('connection', connectionHandler);

    console.log('Server has been started');
  } catch (connectionError) {
    console.log(connectionError.message);
  }
}

run()
;
