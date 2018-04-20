import { NEAREST_PARKING, CURRENT_LOCATION } from '../actions';

export default function(state={}, action) {
    switch(action.type) {
        case NEAREST_PARKING:
            return { ...state, parking: action.payload };
        
        case CURRENT_LOCATION:
            return { ...state, currentlocation: action.payload }

        default:
            return state;
    }
}