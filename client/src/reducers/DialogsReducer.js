const defaultState = {
  Dialogs: {}
};

export default function DialogsReducer (state = defaultState, action) {
  switch (action.type) {
    case 'SET_DIALOGS':
      const object = Object.fromEntries(action.value.map((item) => ([item._id, item])));
      return { ...state, Dialogs: object };
    case 'INSERT_DIALOG':
      const { _id, ...dialog } = action.value;
      return { ...state, Dialogs: { ...state.Dialogs, [_id]: dialog } };
    case 'SET_UNREADEDMESSAGESCOUNT':
      return { ...state, Dialogs: { ...state.Dialogs, [action.value[1]]: { ...state.Dialogs[action.value[1]], unreadedMessagesCount: action.value[0] } } };
    case 'SET_LASTMESSAGEWASREADED':
      const updatedDialog = { ...state.Dialogs[action.value[0]] };
      updatedDialog.lastMessage.isReaded = action.value[1];
      return { ...state, Dialogs: { ...state.Dialogs, [action.value[0]]: updatedDialog } };
    default:
      return state;
  }
}

export const setDialogsDefault = { type: 'SET_DIALOGS', value: [] };
