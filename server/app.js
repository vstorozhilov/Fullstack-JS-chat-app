var http = require('http');
var { MongoClient }  = require('mongodb');
var mongoose = require('mongoose');
var { Server } = require('socket.io');
const { resolve } = require('path');
const { runInContext } = require('vm');
const userModel = require("./models/userModel");
const dialogModel = require("./models/dialogModel");
const messageModel = require("./models/messageModel");

async function mainTabHandler(request, response) {

    const [login, password] = request.headers['authorization'].split(":");

    let requestBody = "";

    request.on('data', data=>{
        requestBody += data;
    })

    request.on('end', async ()=>{

        if (userModel.findOne({login, password}) === null) {
            response.writeHead(401, headers={
                "Access-Control-Allow-Origin" : "*"
            });
            response.write("Unauthorized access");
            response.end();
            return ;
        }

        let {action, ...requestPayment} = JSON.parse(requestBody);

        switch (action){

            case('updateAll'):
            {
                let user = await userModel.findOne({login});

                let contacts = await userModel.find();

                let dialogs = await dialogModel.find({$or : [
                    {"peerOne" : login},
                    {"peerTwo" : login}
                ]});

                let populatingPromises = dialogs.map(async item=>{
                    await item.populate("lastMessage");
                });

                await Promise.all(populatingPromises);

                let unreadedMessagesCountingPromises = dialogs.map(async item=>{
                    item.unreadedMessagesCount = (await messageModel.find({'author' : {$ne : login},
                                                                        'isReaded' : false,
                                                                        'dialog' : item._id})).length;
                    }
                )
                
                await Promise.all(unreadedMessagesCountingPromises);
                response.writeHead(200, headers={
                    "Access-Control-Allow-Origin" : "*"
                });
                response.write(JSON.stringify([contacts, dialogs, user]));
                response.end();
                break;
            }
            case("changeMyProfile"):
            {
                let user = await userModel.findOne({login});

                user.profile = requestPayment;

                await user.save();

                response.writeHead(200, headers={
                    "Access-Control-Allow-Origin" : "*"
                });

                response.end();

                break;
            }
            case("startNewDialog"):
            {
                let existingDialog = await dialogModel.findOne({
                       $or :[
                        {peerOne : login, peerTwo : requestPayment.peerLogin},
                        {peerOne : requestPayment.peerLogin, peerTwo : login}
                       ]
                    }
                )

                if (existingDialog) {

                    response.writeHead(200, headers={
                        "Access-Control-Allow-Origin" : "*"
                    });

                    response.write(JSON.stringify([true, existingDialog]));

                    response.end();
                }
                else {

                    let newDialog = new dialogModel({
                        peerOne : login,
                        peerTwo : requestPayment.peerLogin
                    })

                    await newDialog.save();

                    response.writeHead(200, headers={
                        "Access-Control-Allow-Origin" : "*"
                    });

                    response.write(JSON.stringify([false, newDialog]));

                    response.end();
                }
            }
        }

    })

}

async function accountCreationHandler(request, response){

    const [login, password] = request.headers['authorization'].split(":");

    let requestBody = '';

    request.on('data', chunk=>{
        requestBody += chunk;
    })

    request.on('end', async ()=>{

        if ((await userModel.findOne({login})) === null) {
            response.writeHead(401, headers={
                "Access-Control-Allow-Origin" : "*"
            });
            response.write("Current login was already assigned recently");
            response.end();
        }
        else {
            let user = new userModel({
                login,
                password,
                profile : JSON.parse(requestBody)
            })
            user.save();
            response.writeHead(200, headers={
                "Access-Control-Allow-Origin" : "*"
            });
            response.end();
        }
    })
}

async function signupHandler(request, response){

    let [login, password] = request.headers['authorization'].split(":");
    if (await userModel.findOne({login}) === null) {
        response.writeHead(200, headers={
            "Access-Control-Allow-Origin" : "*"
        });
    }
    else {
        response.writeHead(401, headers={
            "Access-Control-Allow-Origin" : "*"
        });
    }
    response.end();
}

async function authenticationHandler(request, response) {
    const [login, password] = request.headers['authorization'].split(":");
    let user = await userModel.findOne({login : login, password : password});
    if (user !== null) {
        response.writeHead(200, headers={
            "Access-Control-Allow-Origin" : "*"
        });
        response.write(JSON.stringify(user.profile));
    }
    else {
        response.writeHead(401, headers={
            "Access-Control-Allow-Origin" : "*"
        });
    }
    response.end();
}

async function messageHandler(request, response) {

    const [login, password] = request.headers['authorization'].split(":");

    let requestBody = ""

    request.on('data', chunk=>{
        requestBody += chunk;
    })

    request.on("end", async ()=>{

        if ((await userModel.findOne({login, password})) === null) {
            response.writeHead(401, headers={
                "Access-Control-Allow-Origin" : "*"
            });
            response.write("Unauthorized access");
            response.end();
            return ;
        }

        const {action, ...requestPayment} = JSON.parse(requestBody);

        switch(action){
            case("message was readed") : {
                let message = await messageModel.findOne({_id : requestPayment.messageId});
                message.isReaded = true;
                await message.save();
                response.writeHead(200, headers={
                    "Access-Control-Allow-Origin" : "*"
                })
                response.end();
                break;
            }
            case("fetch messages") : {
                let messages = await messageModel.find({dialog : requestPayment.dialogId});
                let dictMessages =  Object.fromEntries(messages.map((item)=>([item._id, item])));
                response.writeHead(200, headers={
                    "Access-Control-Allow-Origin" : "*"
                });
                response.write(JSON.stringify(dictMessages));
                response.end();
                break;
            }
            case("message was sended") : {
                let message = new messageModel({
                    author: login,
                    content : requestPayment.content,
                    dialog : requestPayment.dialogId
                });
                await message.save();
                let dialog = await dialogModel.findOne({_id : requestPayment.dialogId});
                dialog.lastMessage = message._id;
                await dialog.save();
                response.writeHead(200, headers={
                    "Access-Control-Allow-Origin" : "*"
                });
                response.end();
                break;
            }
        }
    })
}

async function run() {

    try { 
        await mongoose.connect('mongodb://localhost:27017/backendDraft');
        let httpserver = http.createServer(async (req, res)=>{
            try {
                if (req.method === "OPTIONS") {
                    res.writeHead(200, headers={
                        "Access-Control-Allow-Origin" : "*",
                        "Access-Control-Allow-Headers" : "authorization, tab, peer, dialogid, messageid",
                        "Access-Control-Allow-Methods" : "GET, POST, OPTIONS, DELETE"
                    });
                    res.end();
                }
                else {
                    switch(req.url) {
                        case('/login') : 
                            await authenticationHandler(req, res);
                            break;
                        case('/loginpassword') :
                            await signupHandler(req, res);
                            break;
                        case('/signup') :
                            await accountCreationHandler(req, res);
                            break;
                        case('/main') :
                            await mainTabHandler(req, res);
                            break;
                        case('/dialog') :
                            await messageHandler(req, res);
                            break;
                    }
                }
            }
            catch (internalError) {
                res.writeHead(500, headers={
                    "Access-Control-Allow-Origin" : "*"
                });
                res.write(internalError.message);
            }
        });
        httpserver.listen(8090);

        const socketioserver = new Server(httpserver, {cors : true});

        socketioserver.on("connection", async socket=>{

            console.log("connected to socketio");

            if ((await userModel.exists({login : socket.handshake.auth.login,
                                        password : socket.handshake.auth.password})) === null) {
                socket.disconnect();
                return ;
            }

            let contactsChangeStream = userModel.watch([
            ], {'fullDocument' : "updateLookup"});

            contactsChangeStream.on('change', async __ => {
                console.log("contacts changed");
                const actualContacts = await userModel.find();
                socket.emit("contacts changed", actualContacts);
            });

            let currentUser = await userModel.findOne({login : socket.handshake.auth.login});
            currentUser.isOnline = true;
            await currentUser.save();

            let dialogs = (await dialogModel.find({
                $match :
                    {$or :
                    [{"peerOne" : socket.handshake.auth.login},
                    {"peerTwo" : socket.handshake.auth.login}]
                }
            }, {"_id" : 1})).map(item=>item._id);

            let wholeRelatedMessageChangeStream = messageModel.watch([{
                $match : {$or :
                    dialogs.map(item=>({'fullDocument.dialog' : item}))
                }
            }], {'fullDocument' : "updateLookup"});

            wholeRelatedMessageChangeStream.on('change', async data=>{
                console.log("Changggged");
                let dialog = await dialogModel.findOne({_id : data.fullDocument.dialog});
                if (data.operationType === "update" &&
                dialog.lastMessage.equals(data.documentKey._id) &&
                data.fullDocument.author === socket.handshake.auth.login) {
                    socket.emit("last message was readed", [data.fullDocument.dialog, data.fullDocument.isReaded]);
                }
                let unreadedMessagesCount = (await messageModel.find({'author' : {$ne : socket.handshake.auth.login},
                                'isReaded' : false,
                                'dialog' : data.fullDocument.dialog})).length;

                socket.emit("unreaded messages count was changed",
                [unreadedMessagesCount, data.fullDocument.dialog]);
            });

            socket.on("dialog has selected", dialogId=>{

                console.log("selected");

                console.log(typeof dialogId)
            
                let messageSendedChangeStream = messageModel.watch([
                    {$match : { $and : [{ "operationType": 'insert' }, {"fullDocument.dialog" : mongoose.Types.ObjectId(dialogId)}]}},
                    {"$project" : {"fullDocument" : 1}}
                ], 
                    {'fullDocument' : "updateLookup"});


                let messageReadedChangeStream = messageModel.watch([
                    {$match : {"fullDocument.dialog" : mongoose.Types.ObjectId(dialogId)}},
                    {$addFields: {
                        "tmpfields":{
                        "$objectToArray":"$updateDescription.updatedFields"}
                    }},
                    {"$match" : {"tmpfields.k" : {"$eq" : "isReaded"}}},
                    {"$project" : {"documentKey" : 1}}],
                    {'fullDocument' : "updateLookup"});

                messageSendedChangeStream.on("change", data=>{
                    console.log("message sended");
                    socket.emit("message sended", data.fullDocument);
                });

                messageReadedChangeStream.on('change', data=>{
                    socket.emit("message was readed", data.documentKey._id);
                });

                socket.on('exit from dialog', async ()=>{
                    messageReadedChangeStream.close();
                    messageSendedChangeStream.close();
                    if (await dialogModel.exists({_id : dialogId, lastMessage : null})){
                        await dialogModel.deleteOne({_id : dialogId});
                    }
                    socket.removeAllListeners("exit from dialog");
                })

            });

            let userChangeStream = userModel.watch([{ $match: { 'fullDocument.login': socket.handshake.auth.login}},
                                                    {"$project" : {"fullDocument" : 1}}],
                                                    {'fullDocument' : "updateLookup"});

            userChangeStream.on('change', data=>{
                socket.emit('user changed', data.fullDocument);
            });

            let dialogsChangeStream = dialogModel.watch([
            {$match :
                {$or : [
                        {"fullDocument.peerOne" : socket.handshake.auth.login},
                        {"fullDocument.peerTwo" : socket.handshake.auth.login},
                        {"operationType" : "delete"}
                    ]
                }
            },
            ],
                {'fullDocument' : "updateLookup"});


            dialogsChangeStream.on('change', async data=>{

                const actualDialogs = await dialogModel.find({
                    $or : [{"peerOne" : socket.handshake.auth.login},
                            {"peerTwo" : socket.handshake.auth.login}]
                });

                let promises = actualDialogs.filter(item=>(item.lastMessage !== null)).map(async item=>{await item.populate("lastMessage");
                item.unreadedMessagesCount = (await messageModel.find({'author' : {$ne : socket.handshake.auth.login},
                                                                  'isReaded' : false,
                                                                  'dialog' : item._id})).length;});
                console.log('dialog changed')
                await Promise.all(promises);

                if (data.operationType !== "insert" ||
                    (data.operationType === "insert" &&
                    data.fullDocument.peerOne !== socket.handshake.auth.login)){
                        socket.emit("dialogs changed", actualDialogs);
                    }
                
                if (data.operationType === "insert"){

                    wholeRelatedMessageChangeStream.close();
    
                    dialogs = (await dialogModel.find({
                        $match :
                            {$or :
                            [{"peerOne" : socket.handshake.auth.login},
                            {"peerTwo" : socket.handshake.auth.login}]
                        }
                    }, {"_id" : 1})).map(item=>item._id);
    
                    
                    wholeRelatedMessageChangeStream = messageModel.watch([{
                        $match : {$or :
                            dialogs.map(item=>({'fullDocument.dialog' : item}))
                        }
                    }], {'fullDocument' : "updateLookup"});
                    
                    wholeRelatedMessageChangeStream.on('change', async data=>{
                        console.log("Changggged");
                        let dialog = await dialogModel.findOne({_id : data.fullDocument.dialog});
                        if (data.operationType === "update" &&
                        dialog.lastMessage.equals(data.documentKey._id) &&
                        data.fullDocument.author === socket.handshake.auth.login) {
                            socket.emit("last message was readed", [data.fullDocument.dialog, data.fullDocument.isReaded]);
                        }
                        let unreadedMessagesCount = (await messageModel.find({'author' : {$ne : socket.handshake.auth.login},
                        'isReaded' : false,
                        'dialog' : data.fullDocument.dialog})).length;
                        
    
                        socket.emit("unreaded messages count was changed",
                        [unreadedMessagesCount, data.fullDocument.dialog]);
                    });
                }
            });

            socket.on('disconnect', async ()=>{
                userChangeStream.close();
                dialogsChangeStream.close();
                wholeRelatedMessageChangeStream.close();
                contactsChangeStream.close();
                currentUser.isOnline = false;
                currentUser.save();
                console.log('connection closed');
            })
        })
        // let dialogs = await dialogModel.find();
        // await dialogs[0].populate({path : "messages",  $slice: [2, 3] }); 
        // console.log(dialogs[0].messages);
        console.log('Server has been started');
    } 
    catch (connectionError) {
        console.log(connectionError.message);
    }
}

run()