import { ADD_INCOMING_ENTRY } from "../actions/types";

export const addIncomingEntry = (entry) => {
  return (dispatch) => {
    dispatch({
      type: ADD_INCOMING_ENTRY,
      payload: entry,
    });
  };
};
