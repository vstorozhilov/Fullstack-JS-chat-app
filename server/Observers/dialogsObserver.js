const DialogModel = require('../Models/DialogModel');
const MessageModel = require('../Models/MessageModel');
const wholeRelatedMessageObserverCreator = require('./wholeRelatedMessagesObserver');

function dialogsObserverCreator (socket, login, wholeRelatedMessageObserver) {
  const dialogsObserver = DialogModel.watch([
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

  dialogsObserver.on('change', async data => {
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
      if (wholeRelatedMessageObserver !== null) wholeRelatedMessageObserver.close();

      wholeRelatedMessageObserver = wholeRelatedMessageObserverCreator(socket, login);
    }
  });

  return dialogsObserver;
}

module.exports = dialogsObserverCreator;
