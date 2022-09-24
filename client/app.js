// const fs = require('fs');

// const decoder = new TextDecoder();

// fs.readFile('build/index.html', (err, data)=>{
//   console.log(decoder.decode(data));
// });

// let https;
// try {
//   https = require('https');
// } catch (err) {
//   console.log('https support is disabled!');
// }

async function foo () {
  throw SyntaxError;
}

async function test () {
  try {
    await foo();
  // prom.catch(e => console.log(e.message));
  } catch (e) {
    console.log('error');
  }
}

test();
