const defaultState = {
  isMainPageOnceRendered: false
};

export default function MainPageOnceRenderedReducer (state = defaultState, action) {
  switch (action.type) {
    case 'SET_IS_MAIN_PAGE_ONCE_RENDERED':
      return { ...state, isMainPageOnceRendered: action.value };
    default:
      return state;
  }
}

export const setMainPageOnceRenderedDefault = { type: 'SET_IS_MAIN_PAGE_ONCE_RENDERED', value: false };
