const MessageModel = require('../models/messageModel');
const mongoose = require('mongoose');

function messageSendingObserverCreator (socket, dialogId) {
  const messageSendingObserver = MessageModel.watch([
    { $match: { $and: [{ operationType: 'insert' }, { 'fullDocument.dialog': mongoose.Types.ObjectId(dialogId) }] } },
    { $project: { fullDocument: 1 } }
  ],
  { fullDocument: 'updateLookup' });

  messageSendingObserver.on('change', data => {
    console.log('message sended');
    socket.emit('message sended', data.fullDocument);
  });

  return messageSendingObserver;
}

module.exports = messageSendingObserverCreator;
