var http = require('http');
var { MongoClient }  = require('mongodb');
var mongoose = require('mongoose');
var { Server } = require('socket.io');
const { resolve } = require('path');
const { runInContext } = require('vm');
const userModel = require("./models/userModel");
const dialogModel = require("./models/dialogModel");
const messageModel = require("./models/messageModel");


var authorizedClients = [];

async function mainTabHandler(request, response) {

    const [login, password] = request.headers['authorization'].split(":");

    const tab = request.headers['tab'];

    let user = await userModel.findOne({login});

    switch (tab){
        case('main'):
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
            
            // console.log(correctDialogs);
            await Promise.all(unreadedMessagesCountingPromises);
            // let unreadedMessagesCount = (await messageModel.find({'author' : {$ne : login},
            //                     'isReaded' : false,
            //                     'dialog' : {$in : dialogs.map(item=>mongoose.Types.ObjectId(item._id))}})).length;
            //await dialogs[0].populate("messages").exec((story, err)=>{console.log(story)});
            //console.log(mess);

            //await Promise.all(populatingPromises);
            response.writeHead(200, headers={
                "Access-Control-Allow-Origin" : "*"
            });
            response.write(JSON.stringify([contacts, dialogs, user]));
            response.end();
            break;
        case('profile'):
            let profile =''
            request.on('data', data=>{
                profile += data;
            })
            request.on('end', async ()=>{
                user.profile = JSON.parse(profile);
                await user.save();
                response.writeHead(200, headers={
                    "Access-Control-Allow-Origin" : "*"
                });
                response.end();
            })
            break;
    }
}

async function accountCreationHandler(request, response){
    let data = '';
    const decoder = new TextDecoder();
    const [login, password] = request.headers['authorization'].split(":");
    request.on('data', chunk=>{
        data += decoder.decode(chunk);
    })
    request.on('end', chunk=>{
        let user = new userModel({
            login,
            password,
            profile : JSON.parse(data)
        })
        user.save();
        response.writeHead(200, headers={
            "Access-Control-Allow-Origin" : "*"
        });
        response.end();
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
        authorizedClients.push({login : login, password : password});
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

function socketSubscribersHandler(socket) {

}

async function messageHandler(request, response) {
    const [login, password] = request.headers['authorization'].split(":");
    if (request.headers['messageid']){
        //console.log(request.headers['messageid']);
        let message = await messageModel.findOne({_id : request.headers['messageid']});
        //console.log("lol pip");
        message.isReaded = true;
        await message.save();
        response.writeHead(200, headers={
            "Access-Control-Allow-Origin" : "*"
        })
        response.end();
        return ;
    } 
    let dialog = await dialogModel.findOne({_id : request.headers['dialogid']});
    switch (request.method) {
        case ("POST"):
            let content = '';
            request.on("data", data=>{
                content += data;
            });
            request.on('end', async ()=>{
                let message = new messageModel({author: login, content, dialog : request.headers['dialogid']});
                await message.save();
                //dialog.messages.push(message._id);
                dialog.lastMessage = message._id;
                await dialog.save();
                response.writeHead(200, headers={
                    "Access-Control-Allow-Origin" : "*"
                });
                response.end();
            })
            break;
        case ("GET"):
            let correctMessages = await messageModel.find({dialog : request.headers['dialogid']})
            let buffer =  correctMessages.map((item)=>([item._id, item]));
            let object = Object.fromEntries(buffer);
            
            response.writeHead(200, headers={
                "Access-Control-Allow-Origin" : "*"
            });
            response.write(JSON.stringify(object));
            response.end();
            break;
    }
    // let content = ''
    // request.on("data", data=>{
    //     content += data; 
    // });
    // request.on('end', async ()=>{
    //     let dialog = await dialogModel.findOne({_id : request.headers['dialogid']});
    //     let message = new messageModel({author: login, content});
    //     await message.save();
    //     dialog.messages.push(message._id);
    //     await dialog.save();
    //     response.writeHead(200, headers={
    //         "Access-Control-Allow-Origin" : "*"
    //     });
    //     response.end();
    // })
}


// var messageSendedChangeStream = null;
// var messageReadedChangeStream = null;

async function run() {

    try { 
        await mongoose.connect('mongodb://localhost:27017/backendDraft');
        //userModel.watch().on('change', (data)=>{console.log(data)});
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

                socket.on('exit from dialog', ()=>{
                    messageReadedChangeStream.close();
                    messageSendedChangeStream.close();
                    socket.removeAllListeners("exit from dialog");
                })

            });

            let userChangeStream = userModel.watch([{ $match: { 'fullDocument.login': socket.handshake.auth.login}},
                                                    {"$project" : {"fullDocument" : 1}}],
                                                    {'fullDocument' : "updateLookup"});

            let contactsChangeStream = userModel.watch([
            ], {'fullDocument' : "updateLookup"});

            userChangeStream.on('change', data=>{
                socket.emit('user changed', data.fullDocument);
            });

            contactsChangeStream.on('change', async __ => {
                const actualContacts = await userModel.find();
                socket.emit("contacts changed", actualContacts);
            });

            let dialogsChangeStream = dialogModel.watch([
            {$match :
                {$or : [
                        {"fullDocument.peerOne" : socket.handshake.auth.login},
                        {"fullDocument.peerTwo" : socket.handshake.auth.login}
                    ]
                }
            }
            ],
                {'fullDocument' : "updateLookup"});


            dialogsChangeStream.on('change', async data=>{

                const actualDialogs = await dialogModel.find({
                    $or : [{"peerOne" : socket.handshake.auth.login},
                            {"peerTwo" : socket.handshake.auth.login}]
                });

                let promises = actualDialogs.map(async item=>{await item.populate("lastMessage");
                item.unreadedMessagesCount = (await messageModel.find({'author' : {$ne : socket.handshake.auth.login},
                                                                    'isReaded' : false,
                                                                    'dialog' : item._id})).length;});
                await Promise.all(promises);
                // let populatingPromises = actualDialogs.map(async item=>{
                //     item.messages = item.messages.slice(item.messages.length - 1,);
                //     await item.populate('messages');
                // });
                // await Promise.all(populatingPromises);

                socket.emit("dialogs changed", actualDialogs);
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