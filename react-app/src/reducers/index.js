import { combineReducers } from 'redux';
import authReducer from './authreducer';

const rootReducer = combineReducers({
    auth: authReducer
});

export default rootReducer;