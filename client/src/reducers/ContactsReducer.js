const defaultState = {
  Contacts: {}
};

export default function ContactsReducer (state = defaultState, action) {
  switch (action.type) {
    case 'SET_CONTACTS':
      const buffer =  action.value.map((item)=>([item.login, item]));
      const map = new Map(buffer);
      const object = Object.fromEntries(map.entries());
      return { Contacts: object };
    default:
      return state;
  }
}

export const setContactsDefault = { type: 'SET_CONTACTS', value: [] };
