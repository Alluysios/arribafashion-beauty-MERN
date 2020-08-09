import axios from 'axios';

import {
    GET_ALL_PRODUCTS,
    GET_PRODUCT,
    CREATE_PRODUCT,
    DELETE_PRODUCT,
    UPDATE_PRODUCT,
    ADD_CART,
    REMOVE_CART,
    ADD_REVIEW
} from './type';

export const getAllProducts = (queryString = '') => async dispatch => {
    const config = {
        'Content-Type': 'application/json'
    }

    try {
        const res = await axios.get(`/api/v1/products?${queryString}`, config);
        dispatch({ type: GET_ALL_PRODUCTS, payload: res.data })
    } catch (err) {
        console.log(err);
    }
}

export const createProduct = (formData) => async dispatch => {
    const config = {
        'Content-Type': 'application/json'
    }

    try {
        const res = await axios.post(`/api/v1/products`, formData, config);
        dispatch({ type: CREATE_PRODUCT, payload: res.data })
    } catch (err) {
        alert(err.response.data.message)
    }
}

export const getProduct = (slug) => async dispatch => {
    const config = {
        'Content-Type': 'application/json'
    }

    try {
        const res = await axios.get(`/api/v1/products/${slug}`, config);
        dispatch({ type: GET_PRODUCT, payload: res.data })
    } catch (err) {
        alert(err.response.data.message)
    }
}

export const editProduct = (pid, formData) => async dispatch => {
    const config = {
        'Content-Type': 'application/json'
    }

    try {
        const res = await axios.patch(`/api/v1/products/${pid}`, formData, config);
        dispatch({ type: UPDATE_PRODUCT, payload: res.data })
    } catch (err) {
        alert(err.response.data.message)
    }
}

export const deleteProduct = (pid) => async dispatch => {
    const config = {
        'Content-Type': 'application/json'
    }

    try {
        const res = await axios.delete(`/api/v1/products/${pid}`, config);
        dispatch({ type: DELETE_PRODUCT, payload: res.data })
    } catch (err) {
        console.log(err);
    }
}

export const addCart = (product) => async dispatch => {
    let cart = []
    if(
        JSON.parse(localStorage.getItem('cart')) && 
        !JSON.parse(localStorage.getItem('cart')).some(item => item._id === product._id)
    ) {
        cart = JSON.parse(localStorage.getItem('cart'));

        cart.unshift(product);

        dispatch({ type: ADD_CART, payload: cart });
    }
}

export const removeCart = (pid) => async dispatch => {
    let cart = []
    if(JSON.parse(localStorage.getItem('cart'))) {
        cart = JSON.parse(localStorage.getItem('cart'));
    }
    
    cart = cart.filter(product => product._id !== pid)
    localStorage.setItem('cart', JSON.stringify(cart));

    dispatch({ type: REMOVE_CART, payload: cart });
}

export const rateProduct = (formData, pid) => async dispatch => {
    const config = {
        'Content-Type': 'application/json'
    }

    try {
        const res = await axios.post(`/api/v1/products/${pid}/reviews`, formData, config);
        dispatch({ type: ADD_REVIEW, payload: res.data });
    } catch (err) {
        alert(err.response.data.message)
    }
}