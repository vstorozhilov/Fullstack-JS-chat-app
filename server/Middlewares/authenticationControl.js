const jwt = require('jsonwebtoken');
const UserModel = require('../Models/UserModel');

async function authenticationControl (token) {
  try {
    const decoded = jwt.verify(token, 'test key');
    const { login } = await UserModel.findById(decoded.id);
    return login;
  } catch (e) {
    return null;
  }
}

module.exports = authenticationControl;
