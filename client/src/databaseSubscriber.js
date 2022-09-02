import { io } from "socket.io-client";
//import { useDispatch } from "react-redux";
import { store } from "./reducers/index";
import {ArrowBack, PhotoCamera, Mode, Photo} from '@mui/icons-material'
import { expose } from "comlink";
//import { Worker, workerData, parentPort } from 'worker_threads';

export var socket;

export default function databaseSubscriber(login) {

    socket = io("http://localhost:8090", {auth : {login}});

    socket.on('user changed', data=>{
        console.log(data);
        store.dispatch({type: 'SET_USER', value: data});
    })

    socket.on('contacts changed', data=>{
        console.log(data);
        store.dispatch({type: 'SET_CONTACTS', value: data});
    })

    socket.on('dialogs changed', data=>{
        console.log(data);
        store.dispatch({type: 'SET_DIALOGS', value: data});
    })

    socket.on('unreaded messages count was changed', data=>{
        console.log(data[0])
        store.dispatch({type : "SET_UNREADEDMESSAGESCOUNT", value : data})
    })

    socket.on('last message was readed', data=>{
        store.dispatch({type : "SET_LASTMESSAGEWASREADED", value : data})
    })

    // socket.on('message sended', data=>{
    //     store.dispatch({type: 'ADD_MESSAGE', value: data});
    //     console.log(data);
    // })

    // socket.on('message was readed', data=>{
    //     console.log(data);
    //     store.dispatch({type : "SET_ISREADED", value : data});
    // })

}

export function dialogIsSelected(dialogId) {
    socket.emit("dialog has selected", dialogId);

    socket.on('message sended', data=>{
        store.dispatch({type: 'ADD_MESSAGE', value: data});
        console.log(data);
    })

    socket.on('message was readed', data=>{
        console.log(data);
        store.dispatch({type : "SET_ISREADED", value : data});
    })
}

export function exitFromDialog() {

    console.log("Exited");

    socket.emit("exit from dialog");

    socket.removeAllListeners('message sended');

    socket.removeAllListeners('message was readed');

    store.dispatch({type : "CLEAR_MESSAGES"});
}

// window.self.addEventListener("connect", e=>{

//     let socket = io("http://localhost:8090", {auth : {login : "Koluzov"}});

//     socket.on('user changed', data=>{
//         console.log(data);
//         store.dispatch({type: 'SET_USER', value: data.fullDocument});
//     })

//     socket.on('contacts changed', data=>{
//         console.log(data);
//         store.dispatch({type: 'SET_CONTACTS', value: data});
//     })

//     socket.on('dialogs changed', data=>{
//         console.log(data);
//         store.dispatch({type: 'SET_DIALOGS', value: data});
//     })

//     socket.on('message sended', data=>{
//         store.dispatch({type: 'ADD_MESSAGE', value: data});
//         console.log(data);
//     })

//     socket.on('message was readed', data=>{
//         console.log(data);
//         store.dispatch({type : "SET_ISREADED", value : data});
//     })
// }
// );






//eslint-disable-next-line import/no-anonymous-default-export
// export default () => {
//     // eslint-disable-next-line no-restricted-globals
//     self.onmessage = (message) => {

//         //var socket;
//         console.log("Messaged");

//         let socket = io("http://localhost:8090", {auth : {login : message.data}});

//         socket.on('user changed', data=>{
//             console.log(data);
//             store.dispatch({type: 'SET_USER', value: data.fullDocument})
//         })

//         socket.on('contacts changed', data=>{
//             console.log(data);
//             store.dispatch({type: 'SET_CONTACTS', value: data});
//         })

//         socket.on('dialogs changed', data=>{
//             console.log(data);
//             store.dispatch({type: 'SET_DIALOGS', value: data});
//         })

//         socket.on('message sended', data=>{
//             store.dispatch({type: 'ADD_MESSAGE', value: data});
//             console.log(data);
//         })

//         socket.on('message was readed', data=>{
//             console.log(data);
//             store.dispatch({type : "SET_ISREADED", value : data});
//         })
//     }
// }

// onmessage = message=>{

//     console.log("Messaged");

//     let socket = io("http://localhost:8090", {auth : {login : message.data}});

//     socket.on('user changed', data=>{
//         console.log(data);
//         store.dispatch({type: 'SET_USER', value: data.fullDocument})
//     })

//     socket.on('contacts changed', data=>{
//         console.log(data);
//         store.dispatch({type: 'SET_CONTACTS', value: data});
//     })

//     socket.on('dialogs changed', data=>{
//         console.log(data);
//         store.dispatch({type: 'SET_DIALOGS', value: data});
//     })

//     socket.on('message sended', data=>{
//         store.dispatch({type: 'ADD_MESSAGE', value: data});
//         console.log(data);
//     })

//     socket.on('message was readed', data=>{
//         console.log(data);
//         store.dispatch({type : "SET_ISREADED", value : data});
//     })
// }

function myFunction() {
    console.log("Messaged");
}

const worker = {
    myFunction
}

expose(worker);

