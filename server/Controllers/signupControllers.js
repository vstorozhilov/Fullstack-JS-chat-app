const generateToken = require('../Configs/generateToken');
const UserModel = require('../Models/UserModel');

async function accountCreationHandler (request, response) {
  const [login, password] = request.headers.authorization.split(':');

  let requestBody = '';

  request.on('data', chunk => {
    requestBody += chunk;
  });

  request.on('end', async () => {
    if ((await UserModel.findOne({ login })) === null) {
      const user = new UserModel({
        login,
        password,
        profile: JSON.parse(requestBody)
      });
      user.save();
      response.writeHead(200, headers = {
        'Access-Control-Allow-Origin': '*'
      });
      response.write(JSON.stringify(generateToken(user._id)));
      response.end();
    } else {
      response.writeHead(401, headers = {
        'Access-Control-Allow-Origin': '*'
      });
      response.write('Current login was already assigned recently');
      response.end();
    }
  });
}

async function signupHandler (request, response) {
  const login = request.headers.authorization;
  if (await UserModel.findOne({ login }) === null) {
    response.writeHead(200, headers = {
      'Access-Control-Allow-Origin': '*'
    });
  } else {
    response.writeHead(401, headers = {
      'Access-Control-Allow-Origin': '*'
    });
  }
  response.end();
}

module.exports = { accountCreationHandler, signupHandler };
