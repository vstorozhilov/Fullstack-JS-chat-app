const defaultState = {
  Messages: {}
};

export default function MessagesReducer (state = defaultState, action) {
  switch (action.type) {
    case 'SET_MESSAGES':
      console.log(action.value);
      return {...state, Messages: action.value };
    case 'ADD_MESSAGE':
      console.log(action.value);
      return { ...state, Messages: { ...state.Messages, [action.value._id]: action.value } };
    case 'SET_ISREADED':
      console.log(action.value);
      const newmessage = state.Messages[action.value];
      newmessage.isReaded = true;
      return {...state, Messages: { ...state.Messages, [action.value]: newmessage } };
    case 'CLEAR_MESSAGES':
      return {...state, Messages: {} };
    default:
      return state;
  }
}

export const setMessagesDefault = { type: 'SET_MESSAGES', value: {} };
