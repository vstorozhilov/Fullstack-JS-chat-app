const fs = require('fs');

const urlSearch = (url) => (
  (url.endsWith('/')) ||
  (url.endsWith('/main')) ||
  (url.endsWith('/login')) ||
  (url.endsWith('/dialog')) ||
  (url.endsWith('/createaccount')) ||
  (url.endsWith('/signup'))
);

function staticHandler (request, response) {
  fs.readFile(`./client/build${urlSearch(request.url) ? '/index.html' : request.url}`, (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    response.writeHead(200, {
      'Access-Control-Allow-Origin': '*'
    });
    response.write(data);
    response.end();
  });
}

module.exports = staticHandler;
