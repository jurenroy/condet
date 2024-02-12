import { combineReducers } from 'redux';
import AuthReducer from './Auth/AuthSlice';
import BulkReducer from './Bulk/BulkSlice';

const rootReducer = combineReducers({
  auth: AuthReducer,
  bulk: BulkReducer,
});

export default rootReducer;