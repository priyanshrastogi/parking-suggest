import { SIGNIN_USER, SIGNOUT_USER } from '../actions/index'

export default function (state = {}, action) {
    switch (action.type) {
        case SIGNIN_USER:
            return { ...state, authenticated: true };

        case SIGNOUT_USER:
            return {...state, authenticated: false };
        
        default:
            return state;
    }
}