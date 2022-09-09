const authentificationControl = require('../Middlewares/authenticationControl');
const DialogModel = require('../models/DialogModel');
const MessageModel = require('../models/MessageModel');
const UserModel = require('../models/userModel');

async function messageWasReaded (response, requestPayment) {
  const message = await MessageModel.findOne({ _id: requestPayment.messageId });
  message.isReaded = true;
  await message.save();
  response.writeHead(200, headers = {
    'Access-Control-Allow-Origin': '*'
  });
  response.end();
}

async function fetchAllMessages (response, requestPayment) {
  const messages = await MessageModel.find({ dialog: requestPayment.dialogId });
  const dictMessages = Object.fromEntries(messages.map((item) => ([item._id, item])));
  console.log(dictMessages);
  response.writeHead(200, headers = {
    'Access-Control-Allow-Origin': '*'
  });
  response.write(JSON.stringify(dictMessages));
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
  response.writeHead(200, headers = {
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
      response.writeHead(401, headers = {
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
        fetchAllMessages(response, requestPayment);
        break;
      case ('message was sended') :
        sendMessage(response, login, requestPayment);
        break;
    }
  });
}

module.exports = messageHandler;
