const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
  {
    author : String,
    content :  String,
    isReaded : {type : Boolean, default : false},
    dialog : {type : mongoose.Schema.Types.ObjectId, ref : "Dialogs"}
  },
  { collection: "Messages" }
);

const messageModel = mongoose.model("Message", messageSchema);
module.exports = messageModel;