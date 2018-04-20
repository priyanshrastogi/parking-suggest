import { combineReducers } from 'redux';
import authReducer from './authreducer';
import nearestparkingReducer from './nearestparkingreducer';

const rootReducer = combineReducers({
    auth: authReducer,
    nearestparking: nearestparkingReducer
});

export default rootReducer;