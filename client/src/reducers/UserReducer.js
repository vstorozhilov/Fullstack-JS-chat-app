const defaultState = {
  User: { login: null, profile: {} }
};

export default function UserReducer (state = defaultState, action) {
  switch (action.type) {
    case 'SET_USER':
      const { login, profile } = action.value;
      return { User: { login, profile } };
    default:
      return state;
  }
}

export const setUserDefault = { type: 'SET_USER', value: { login: null, profile: {} } };
