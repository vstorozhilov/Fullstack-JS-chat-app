const UserModel = require('../Models/UserModel');
const DialogModel = require('../Models/DialogModel');
const MessageModel = require('../Models/MessageModel');
const authentificationControl = require('../Middlewares/authenticationControl');

async function updateAll (response, login) {
  const user = await UserModel.findOne({ login });

  const contacts = await UserModel.find();

  const dialogs = await DialogModel.find({
    $or: [
      { peerOne: login },
      { peerTwo: login }
    ]
  });

  const populatingPromises = dialogs.map(async item => {
    await item.populate('lastMessage');
  });

  await Promise.all(populatingPromises);

  const unreadedMessagesCountingPromises = dialogs.map(async item => {
    item.unreadedMessagesCount = (await MessageModel.find({
      author: { $ne: login },
      isReaded: false,
      dialog: item._id
    })).length;
  }
  );

  await Promise.all(unreadedMessagesCountingPromises);
  response.writeHead(200, {
    'Access-Control-Allow-Origin': '*'
  });
  response.write(JSON.stringify([contacts, dialogs, user]));
  response.end();
}

async function changeOwnProfile (requestPayment, response, login) {
  const user = await UserModel.findOne({ login });

  user.profile = requestPayment;

  await user.save();

  response.writeHead(200, {
    'Access-Control-Allow-Origin': '*'
  });

  response.end();
}

async function startNewDialog (requestPayment, response, login) {
  const existingDialog = await DialogModel.findOne({
    $or: [
      { peerOne: login, peerTwo: requestPayment.peerLogin },
      { peerOne: requestPayment.peerLogin, peerTwo: login }
    ]
  }
  );

  if (existingDialog) {
    response.writeHead(200, {
      'Access-Control-Allow-Origin': '*'
    });

    response.write(JSON.stringify([true, existingDialog]));

    response.end();
  } else {
    const newDialog = new DialogModel({
      peerOne: login,
      peerTwo: requestPayment.peerLogin
    });

    await newDialog.save();

    response.writeHead(200, {
      'Access-Control-Allow-Origin': '*'
    });

    response.write(JSON.stringify([false, newDialog]));

    response.end();
  }
}

async function mainTabHandler (request, response) {
  const token = request.headers.authorization;

  let requestBody = '';

  request.on('data', data => {
    requestBody += data;
  });

  request.on('end', async () => {
    const login = await authentificationControl(token);

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
      case ('updateAll'):
        await updateAll(response, login);
        break;

      case ('changeMyProfile'):
        await changeOwnProfile(requestPayment, response, login);
        break;

      case ('startNewDialog'):
        await startNewDialog(requestPayment, response, login);
    }
  });
}

module.exports = mainTabHandler;
