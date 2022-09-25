const MessageModel = require('../Models/MessageModel');
const mongoose = require('mongoose');

function messageReadingObserverCreator (socket, dialogId) {
  const messageReadingObserver = MessageModel.watch([
    { $match: { 'fullDocument.dialog': mongoose.Types.ObjectId(dialogId) } },
    {
      $addFields: {
        tmpfields: { $objectToArray: '$updateDescription.updatedFields' }
      }
    },
    { $match: { 'tmpfields.k': { $eq: 'isReaded' } } },
    { $project: { documentKey: 1 } }],
  { fullDocument: 'updateLookup' });

  messageReadingObserver.on('change', data => {
    console.log('message was readed');
    socket.emit('message was readed', data.documentKey._id);
  });

  return messageReadingObserver;
}

module.exports = messageReadingObserverCreator;
