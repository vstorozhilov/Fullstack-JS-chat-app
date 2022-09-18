const defaultState = {
  selectedDialog: undefined
};

export default function SelectDialogReducer (state = defaultState, action) {
  switch (action.type) {
    case 'SET_SELECTED_DIALOG':
      return { ...state, selectedDialog: action.value };
    default:
      return state;
  }
}

export const setSelectedDialogDefault = { type: 'SET_SELECTED_DIALOG', value: defaultState };
