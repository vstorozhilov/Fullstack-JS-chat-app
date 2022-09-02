const { workerData, parentPort } = require("worker_threads");

console.log("Hello, i am thread " + workerData);

parentPort.on("message", message=>{
    console.log("message from parent :" + message);
})

parentPort.postMessage("lol")