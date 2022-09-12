const MessageModel = require('../models/messageModel');
const DialogModel = require('../models/dialogModel');

async function wholeRelatedMessageObserverCreator (socket, login) {
  const dialogs = (await DialogModel.find({
    $match:
      {
        $or:
      [{ peerOne: login },
        { peerTwo: login }]
      }
  }, { _id: 1 })).map(item => item._id);

  if (dialogs.length !== 0) {
    const wholeRelatedMessageObserver = MessageModel.watch([{
      $match: {
        $or: dialogs.map(item => ({ 'fullDocument.dialog': item }))
      }
    }], { fullDocument: 'updateLookup' });

    wholeRelatedMessageObserver.on('change', async data => {
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
    return wholeRelatedMessageObserver;
  } else {
    return null;
  }
}

module.exports = wholeRelatedMessageObserverCreator;
