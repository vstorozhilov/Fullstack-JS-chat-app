const defaultState = {
    User : {}
};

export default function UserReducer(state = defaultState, action) {
    switch (action.type) {
        case 'SET_USER':
            return {User : action.value}
        default:
            return state
    }
}

export const setUser = {type : 'SET_USER', value : {}};