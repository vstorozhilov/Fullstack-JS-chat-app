const UserModel = require('../Models/UserModel');
const generateToken = require('../Configs/generateToken');

async function authenticationHandler (request, response) {
  const [login, password] = request.headers.authorization.split(':');
  const user = await UserModel.findOne({ login, password });
  if (user !== null) {
    response.writeHead(200, {
      'Access-Control-Allow-Origin': '*'
    });
    response.write(JSON.stringify([
      user.profile,
      generateToken(user._id)
    ]));
  } else {
    response.writeHead(401, {
      'Access-Control-Allow-Origin': '*'
    });
  }
  response.end();
}

module.exports = authenticationHandler;
