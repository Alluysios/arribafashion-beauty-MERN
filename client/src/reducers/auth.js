import Cookies from 'js-cookie';

import {
    LOGIN,
    LOGOUT,
    SIGN_UP,
    LOAD_USER,
    AUTH_ERROR,
    UPDATE_PROFILE,
    UPDATE_PASSWORD
} from '../actions/type';

const initialState = {
    token: Cookies.get('token'),
    loading: true,
    user: null,
    isAuthenticated: false,
}

export default function(state = initialState, action) {
    const { type, payload } = action;

    switch(type) {
        case LOAD_USER:
            return {
                ...state,
                isAuthenticated: true,
                loading: false,
                user: payload
            }
        case LOGIN:
        case SIGN_UP:
        case UPDATE_PROFILE:
        case UPDATE_PASSWORD:
            Cookies.set('token', payload.token, {
                expires: 7
            });
            return {
                ...state,
                ...payload,
                isAuthenticated: true,
                loading: false,
                user: payload.user
            }
        case LOGOUT:
        case AUTH_ERROR:
            Cookies.remove('token');
            return {
                ...state,
                ...payload,
                isAuthenticated: false,
                loading: false,
                user: null
            }
        default: 
            return state;
    }
}