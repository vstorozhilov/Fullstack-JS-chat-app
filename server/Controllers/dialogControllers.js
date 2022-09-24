const { mongoose } = require('mongoose');
const authentificationControl = require('../Middlewares/authenticationControl');
const DialogModel = require('../Models/DialogModel');
const MessageModel = require('../Models/MessageModel');
const UserModel = require('../Models/UserModel');

async function messageWasReaded (response, requestPayment) {
  const message = await MessageModel.findOne({ _id: requestPayment.messageId });
  message.isReaded = true;
  await message.save();
  response.writeHead(200, {
    'Access-Control-Allow-Origin': '*'
  });
  response.end();
}

async function fetchAllMessages (response, login, requestPayment) {
  const messages = await MessageModel.find({ dialog: requestPayment.dialogId });
  const dialog = await DialogModel.findById(mongoose.Types.ObjectId(requestPayment.dialogId));
  const peerLogin = login === dialog.peerOne ? dialog.peerTwo : dialog.peerOne;
  const peer = await UserModel.findOne({ login: peerLogin });
  const dictMessages = Object.fromEntries(messages.map((item) => ([item._id, item])));
  response.writeHead(200, {
    'Access-Control-Allow-Origin': '*'
  });
  response.write(JSON.stringify([dictMessages, peer]));
  response.end();
}

async function sendMessage (response, login, requestPayment) {
  const message = new MessageModel({
    author: login,
    content: requestPayment.content,
    dialog: requestPayment.dialogId,
    date: new Date()
  });
  await message.save();
  const dialog = await DialogModel.findOne({ _id: requestPayment.dialogId });
  dialog.lastMessage = message._id;
  await dialog.save();
  response.writeHead(200, {
    'Access-Control-Allow-Origin': '*'
  });
  response.end();
}

async function messageHandler (request, response) {
  const token = request.headers.authorization;

  let requestBody = '';

  request.on('data', chunk => {
    requestBody += chunk;
  });

  request.on('end', async () => {
    const login = await authentificationControl(token, UserModel);

    if (login === null) {
      response.writeHead(401, {
        'Access-Control-Allow-Origin': '*'
      });
      response.write('Unauthorized access');
      response.end();
      return;
    }

    const { action, ...requestPayment } = JSON.parse(requestBody);

    switch (action) {
      case ('message was readed') :
        messageWasReaded(response, requestPayment);
        break;
      case ('fetch messages') :
        fetchAllMessages(response, login, requestPayment);
        break;
      case ('message was sended') :
        sendMessage(response, login, requestPayment);
        break;
    }
  });
}

module.exports = messageHandler;
