const _ = require('lodash')

const defaultState = {
    Dialogs : {},
    IsOnceRendered: false,
    selectedDialog : undefined,
};

export default function DialogsReducer(state = defaultState, action) {
    switch (action.type) {
        case 'SET_DIALOGS':
            let object = Object.fromEntries(action.value.map((item)=>([item._id, item])));
            return {...state, Dialogs : object}
        case 'SET_IS_DIALOG_PAGE_ONCE_RENDERED':
            return {...state, IsOnceRendered: true}
        case 'SET_SELECTED_DIALOG':
            return {...state, selectedDialog : action.value}
        case 'SET_UNREADEDMESSAGESCOUNT':
            return {...state, Dialogs : {...state.Dialogs, [action.value[1]] : {...state.Dialogs[action.value[1]], unreadedMessagesCount : action.value[0]}}}
        case 'SET_LASTMESSAGEWASREADED':
            let updatedDialog = _.cloneDeep(state.Dialogs[action.value[0]]);
            updatedDialog.lastMessage.isReaded = action.value[1];
            return {...state, Dialogs : {...state.Dialogs, [action.value[0]] : updatedDialog}};
        default:
            return state
    }
}

export const setDialogs = {type : 'SET_DIALOGS', value : []};