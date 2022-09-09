const mongoose = require('mongoose');

const dialogSchema = mongoose.Schema(
  {
    peerOne: String,
    peerTwo: String,
    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message', default: null },
    unreadedMessagesCount: { type: Number, default: 0 }
  },
  { collection: 'Dialogs' }
);

const DialogModel = mongoose.models.Dialog || mongoose.model('Dialog', dialogSchema);
module.exports = DialogModel;
