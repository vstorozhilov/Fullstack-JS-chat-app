const _ = require('lodash')

const defaultState = {
    Messages : {}
};

export default function MessagesReducer(state = defaultState, action) {
    switch (action.type) {
        case 'SET_MESSAGES':
            return {Messages : action.value};
        case 'ADD_MESSAGE':
            return {...state, Messages : {...state.Messages, [action.value._id] : action.value}};
        case 'SET_ISREADED':
            let newmessage = _.cloneDeep(state.Messages[action.value]);
            newmessage.isReaded = true;
            return {Messages : {...state.Messages, [action.value] : newmessage}};
        case 'CLEAR_MESSAGES':
            return {Messages : {}};
        default:
            return state;
    }
}

export const setMessage = {type : 'SET_MESSAGES', value: {}};