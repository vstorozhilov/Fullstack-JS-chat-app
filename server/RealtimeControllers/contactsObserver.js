const UserModel = require('../models/userModel');

function contactsObserverCreator (socket) {
  const contactsObserver = UserModel.watch([
  ], { fullDocument: 'updateLookup' });

  contactsObserver.on('change', async __ => {
    const actualContacts = await UserModel.find();
    socket.emit('contacts changed', actualContacts);
  });

  return contactsObserver;
}

module.exports = contactsObserverCreator;
