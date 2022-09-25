const fs = require('fs');

console.log(JSON.parse(fs.readFileSync('Configs/mongodbConf.json')));
