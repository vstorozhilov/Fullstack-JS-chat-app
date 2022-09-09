const mongoose = require('mongoose');

const messageSchema = mongoose.Schema(
  {
    author: String,
    content: String,
    isReaded: { type: Boolean, default: false },
    dialog: { type: mongoose.Schema.Types.ObjectId, ref: 'Dialogs' },
    date: Date
  },
  { collection: 'Messages' }
);

const MessageModel = mongoose.models.Message || mongoose.model('Message', messageSchema);
module.exports = MessageModel;
