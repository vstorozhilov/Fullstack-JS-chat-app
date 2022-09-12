const UserModel = require('../models/userModel');

function userObserverCreator (socket, login) {
  const userObserver = UserModel.watch([{ $match: { 'fullDocument.login': login } },
    { $project: { fullDocument: 1 } }],
  { fullDocument: 'updateLookup' });

  userObserver.on('change', data => {
    socket.emit('user changed', data.fullDocument);
  });

  return userObserver;
}

module.exports = userObserverCreator;