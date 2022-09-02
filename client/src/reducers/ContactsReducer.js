const defaultState = {
    Contacts : {},
};

export default function ContactsReducer(state = defaultState, action) {
    switch (action.type) {
        case 'SET_CONTACTS':
            let buffer =  action.value.map((item)=>([item.login, item]));
            let map = new Map(buffer);
            let object = Object.fromEntries(map.entries())
            return {Contacts : object}
        default:
            return state
    }
}

export const setDialogs = {type : 'SET_CONTACTS', value : []};