const { Worker, workerData } = require("worker_threads");

let worker = new Worker("./worker_thread", {
    workerData : 10
});

worker.on("message", data=>console.log("message from thread :" + data));