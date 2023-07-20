import { combineReducers } from 'redux';
import AuthReducer from './Auth/AuthSlice';

const rootReducer = combineReducers({
  auth: AuthReducer,
});

export default rootReducer;
