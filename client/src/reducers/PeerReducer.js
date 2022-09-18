const defaultState = {
  Peer: {isOnline : false, profile : {}}
};

export default function PeerReducer (state = defaultState, action) {
  switch (action.type) {
    case 'SET_PEER':
      return {...state, Peer: action.value };
    default:
      return state;
  }
}

export const setPeerDefault = { type: 'SET_PEER', value: defaultState };
