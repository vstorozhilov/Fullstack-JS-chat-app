const mongoose = require("mongoose");

const dialogSchema = mongoose.Schema(
  {
    peerOne : String,
    peerTwo : String,
    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
    unreadedMessagesCount: {type: Number, default : 0}
  },
  { collection: "Dialogs" }
);

const dialogModel = mongoose.model("Dialog", dialogSchema);
module.exports = dialogModel;