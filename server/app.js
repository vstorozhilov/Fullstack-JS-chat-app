const http = require('http');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const mainTabHandler = require('./Controllers/mainTabControllers');
const { accountCreationHandler, signupHandler } = require('./Controllers/signupControllers');
const messageHandler = require('./Controllers/dialogControllers');
const authenticationHandler = require('./Controllers/authenticationControllers');
const connectionObserver = require('./Observers/connectionObserver');

async function run () {
  try {
    await mongoose.connect('mongodb://localhost:27017/backendDraft');
    const httpserver = http.createServer(async (req, res) => {
      try {
        if (req.method === 'OPTIONS') {
          res.writeHead(200, headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'authorization',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
          });
          res.end();
        } else {
          switch (req.url) {
            case ('/login') :
              await authenticationHandler(req, res);
              break;
            case ('/loginpassword') :
              await signupHandler(req, res);
              break;
            case ('/signup') :
              await accountCreationHandler(req, res);
              break;
            case ('/main') :
              await mainTabHandler(req, res);
              break;
            case ('/dialog') :
              await messageHandler(req, res);
              break;
          }
        }
      } catch (internalError) {
        res.writeHead(500, headers = {
          'Access-Control-Allow-Origin': '*'
        });
        res.write(internalError.message);
      }
    });
    httpserver.listen(8090);

    const socketioserver = new Server(httpserver, { cors: true });

    socketioserver.on('connection', connectionObserver);

    // socketioserver.on('connection', socket=>{
    //   socket._error.
    // })

    console.log('Server has been started');
  } catch (connectionError) {
    console.log(connectionError.message);
  }
}

run();
