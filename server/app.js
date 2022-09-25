const http = require('http');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const mainTabHandler = require('./Controllers/mainTabControllers');
const { accountCreationHandler, signupHandler } = require('./Controllers/signupControllers');
const messageHandler = require('./Controllers/dialogControllers');
const authenticationHandler = require('./Controllers/authenticationControllers');
const connectionObserver = require('./Observers/connectionObserver');
const staticHandler = require('./Controllers/staticControllers');
const fs = require('fs');

async function run () {
  try {
    const { mongodbhost, mongodbport, mongodbdatabase } = JSON.parse(fs.readFileSync('server/Configs/mongodbConf.json'));
    await mongoose.connect(`mongodb://${mongodbhost}:${mongodbport}/${mongodbdatabase}`);
    const { serverhost, serverport } = JSON.parse(fs.readFileSync('server/Configs/serverConf.json'));
    const httpserver = http.createServer(async (req, res) => {
      try {
        if (req.method === 'OPTIONS') {
          res.writeHead(200, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'authorization',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
          });
          res.end();
        } else {
          switch (req.url) {
            case ('/api/login') :
              await authenticationHandler(req, res);
              break;
            case ('/api/signup') :
              await signupHandler(req, res);
              break;
            case ('/api/createaccount') :
              await accountCreationHandler(req, res);
              break;
            case ('/api/main') :
              await mainTabHandler(req, res);
              break;
            case ('/api/dialog') :
              await messageHandler(req, res);
              break;
            default :
              staticHandler(req, res);
          }
        }
      } catch (internalError) {
        res.writeHead(500, {
          'Access-Control-Allow-Origin': '*'
        });
        res.write(internalError.message);
      }
    });
    httpserver.listen(serverport, serverhost);

    const socketioserver = new Server(httpserver, { cors: true });

    socketioserver.on('connection', connectionObserver);
  } catch (connectionError) {
    console.log(connectionError.message);
  }
}

run();
