import axios from 'axios';

export const SIGNIN_USER = 'signin_user';
export const SIGNOUT_USER = 'signout_user';
export const NEAREST_PARKING = 'nearest_parking';
export const CURRENT_LOCATION = 'current_location';

const CLOUD_API_URL = 'https://parking-suggest-api.priyanshrastogi.com';

export function signinUser(userInfo, callback) {
    return function (dispatch) {
        localStorage.setItem('token', userInfo.token);
        localStorage.setItem('userId', userInfo.userId);
        localStorage.setItem('name', userInfo.name);
        localStorage.setItem('email', userInfo.email);
        dispatch({ type: SIGNIN_USER });
        callback();
    };
};

export function signoutUser(callback) {
    return function (dispatch) {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('name');
        localStorage.removeItem('email');
        dispatch({ type: SIGNOUT_USER });
        callback();
    };
}

export function findNearestParking() {
    return function (dispatch) {
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const lat = position.coords.latitude;
                const long = position.coords.longitude;
                dispatch({ type: CURRENT_LOCATION, payload: {lat, long} })
                console.log(lat, long);
                axios.get(`${CLOUD_API_URL}/parkings/findnearest?lat=${lat}&long=${long}`)
                .then(response => {
                    console.log(response);
                    dispatch({ type: NEAREST_PARKING, payload: response.data });
                })
                .catch(err => console.log(err));
            }, (err) => {
                alert('Some Error Occured. Pleae Try Again');
            })
        }
        else {
            alert('Gelocation is not supported in your browser.');
        }
    }
}

