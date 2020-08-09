import axios from 'axios';
import setAuthToken from '../helper/setAuthToken';
import Cookies from 'js-cookie';

import {
    LOGIN,
    SIGN_UP,
    LOAD_USER,
    AUTH_ERROR,
    UPDATE_PROFILE,
    UPDATE_PASSWORD
} from './type';

export const loadUser = () => async dispatch => {
    if(Cookies.get('token')) {
        setAuthToken(Cookies.get('token'));
    }

    try {
        const res = await axios.get('/api/v1/users/auth');
        dispatch({ type: LOAD_USER, payload: res.data });
    } catch (err) {
        dispatch({ type: AUTH_ERROR })
    }
}

export const login = (formData) => async dispatch => {
    const config = {
        'Content-Type': 'application/json'
    }

    try {
        const res = await axios.post('/api/v1/users/login', formData, config);
        dispatch({ type: LOGIN, payload: res.data });
    } catch (err) {
        alert(err.response.data.message);
    }
}

export const signup = (formData) => async dispatch => {
    const config = {
        'Content-Type': 'application/json'
    }

    try {
        const res = await axios.post('/api/v1/users/signup', formData, config);
        dispatch({ type: SIGN_UP, payload: res.data });
    } catch (err) {
        alert(err.response.data.message);
    }
}

export const updateProfile = (formData) => async dispatch => {
    const config = {
        'Content-Type': 'application/json'
    }

    try {
        const res = await axios.patch('/api/v1/users/updateMe', formData, config)
        dispatch({ type: UPDATE_PROFILE, payload: res.data })
    } catch (err) {
        alert(err.response.data.message);
    }
}

export const updatePassword = (formData) => async dispatch => {
    const config = {
        'Content-Type': 'application/json'
    }

    try {
        const res = await axios.patch('/api/v1/users/updatePassword', formData, config);
        dispatch({ type: UPDATE_PASSWORD, payload: res.data });
    } catch (err) {
        alert(err.response.data.message);
    }
}