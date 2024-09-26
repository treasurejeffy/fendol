// rootReducer.js
import { combineReducers } from 'redux';
import authReducer from './authReducer'; // Import your auth reducer

const rootReducer = combineReducers({
  auth: authReducer, // Ensure the auth reducer is combined here
});

export default rootReducer;
