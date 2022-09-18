import SelectDialogReducer from './SelectDialogReducer';
import { createStore } from './ReducerManager';
import MainPageOnceRenderedReducer from './MainPageOnceRenderedReducer';

const initialReducers = {
  selectDialogReducer: SelectDialogReducer,
  mainPageOnceRenderedReducer: MainPageOnceRenderedReducer
};

export const store = createStore(initialReducers);
