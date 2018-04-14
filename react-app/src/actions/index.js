export const SIGNIN_USER = 'signin_user';
export const SIGNOUT_USER = 'signout_user';

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

export function findNearestParking(callback) {
    return function (dispatch) {
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const lat = position.coords.latitude;
                const long = position.coords.longitude;
                console.log(lat, long);
            }, (err) => {
                alert('Some Error Occured. Pleae Try Again');
            })
        }
        else {
            alert('Gelocation is not supported in your browser.');
        }
    }
}

