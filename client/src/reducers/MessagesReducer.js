const defaultState = {
  Messages: {}
};

export default function MessagesReducer (state = defaultState, action) {
  switch (action.type) {
    case 'SET_MESSAGES':
      return { ...state, Messages: action.value };
    case 'ADD_MESSAGE':
      return { ...state, Messages: { ...state.Messages, [action.value._id]: action.value } };
    case 'SET_ISREADED':
      const newmessage = { ...state.Messages[action.value] };
      newmessage.isReaded = true;
      return { ...state, Messages: { ...state.Messages, [action.value]: newmessage } };
    default:
      return state;
  }
}

export const setMessagesDefault = { type: 'SET_MESSAGES', value: {} };
