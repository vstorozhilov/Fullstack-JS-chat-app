const fs = require('fs');

const decoder = new TextDecoder();

fs.readFile('build/index.html', (err, data)=>{
  console.log(decoder.decode(data));
});