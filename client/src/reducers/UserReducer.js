const defaultState = {
    User : {}
};

export default function UserReducer(state = defaultState, action) {
    switch (action.type) {
        case 'SET_USER':
            const {login, profile} = action.value;
            return {User : {login, profile}}
        default:
            return state
    }
}

export const setUser = {type : 'SET_USER', value : {}};