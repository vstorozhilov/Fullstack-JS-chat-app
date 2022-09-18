const UserModel = require('../Models/UserModel');
const DialogModel = require('../Models/DialogModel');
const mongoose = require('mongoose');

async function peerObserverCreator (socket, dialogId, login) {
  const dialog = await DialogModel.findById(mongoose.Types.ObjectId(dialogId));
  const peerLogin = login === dialog.peerOne ? dialog.peerTwo : dialog.peerOne;
  const peerObserver = UserModel.watch([
    { $match: { 'fullDocument.login': peerLogin } },
    { $project: { fullDocument: 1 } }],
  { fullDocument: 'updateLookup' });

  peerObserver.on('change', data => {
    socket.emit('peer has been changed', data.fullDocument);
  });

  return peerObserver;
}

module.exports = peerObserverCreator;
