import incomingReducer from "./incomingReducer";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  incoming: incomingReducer,
});

export default rootReducer;
