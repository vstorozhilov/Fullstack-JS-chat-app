const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, 'test key', {
    expiresIn: '30d'
  });
};

module.exports = generateToken;
