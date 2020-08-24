import axios from 'axios';

import * as actionTypes from './actionTypes';

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START,
        loading: true
    };
};

export const authSuccess = (token, userId) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        token: token,
        userId: userId,
    };
};

export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error,
    };
};

export const logOut = () => {

    localStorage.removeItem('token')
    localStorage.removeItem('expirationDate')
    localStorage.removeItem('userId')

    return {type: actionTypes.AUTH_LOGOUT}
}


export const checkAuthTimeOut = (expirationTime) => {

    return dispatch => {
        setTimeout(() => {
            dispatch(logOut())
        }, expirationTime * 1000);
    }
}

export const authRedirectPath = (path) => {
    return {
        type: actionTypes.SET_AUTH_REDIRECT_PATH,
        path: path
    }
}

export const authCheckState = () => {
    return dispatch => {
        const token = localStorage.getItem('token')
        if(!token) {
            dispatch(logOut())
        } else {
            const expirationTime = new Date(localStorage.getItem('expirationDate'));

            if(expirationTime > new Date()) {
                const userId = localStorage.getItem('userId');
                dispatch(authSuccess(token, userId));
                dispatch(checkAuthTimeOut(expirationTime.getTime() / 1000 - new Date().getTime() / 1000))

            }
            else {
                dispatch(logOut());
            }
        }
    }
}


export const auth = (email, password, isSignup) => {
    return dispatch => {
        dispatch(authStart());
        const authData = {
            email: email,
            password: password,
            returnSecureToken: true
        };
        let url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyAfxdSa0d7o1Mfby_52I9HHgD6JePajA4Q';
        if (!isSignup) {
            url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyAfxdSa0d7o1Mfby_52I9HHgD6JePajA4Q';
        }
        axios.post(url, authData)
            .then(response => {

                const expirationDate = new Date(new Date().getTime() + response.data.expiresIn*1000);

                localStorage.setItem('token', response.data.idToken)
                localStorage.setItem('expirationDate', expirationDate)
                localStorage.setItem('userId', response.data.localId)

                dispatch(authSuccess(response.data.idToken, response.data.localId));
                dispatch(checkAuthTimeOut(response.data.expiresIn))
            })
            .catch(err => {
                dispatch(authFail(err.response.data.error));
            });
    };
};