import { ADD_INCOMING_ENTRY } from "../actions/types";

const initialState = { entries: [] };

const incomingReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_INCOMING_ENTRY:
      return { ...state, entries: [action.payload, ...state.entries] };
    default:
      return state;
  }
};

export default incomingReducer;
