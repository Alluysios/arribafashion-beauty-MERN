import {
    GET_ALL_PRODUCTS,
    GET_PRODUCT,
    CREATE_PRODUCT,
    DELETE_PRODUCT,
    UPDATE_PRODUCT,
    ADD_CART,
    REMOVE_CART,
    ADD_REVIEW
} from '../actions/type';


const initialState = {
    loading: true,
    products: [],
    product: null,
    cart: {
        subtotal: 0,
        gst: 0,
        total: 0,
        items: localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : []
    }
}

export default (state = initialState, action) => {
    const { type, payload } = action;

    switch(type) {
        case GET_ALL_PRODUCTS:
            return {
                ...state,
                products: payload.products,
                loading: false
            }
        case GET_PRODUCT:
        case ADD_REVIEW:
            return {
                ...state,
                product: payload.product,
                loading: false
            }
        case CREATE_PRODUCT:
            return {
                ...state,
                products: [...state.products, payload.product],
                loading: false
            }
        case DELETE_PRODUCT:
            return {
                ...state,
                products: payload.products,
                loading: false
            }
        case UPDATE_PRODUCT:
            return {
                ...state,
                product: payload.product,
                loading: false
            }
        case ADD_CART:
            localStorage.setItem('cart', JSON.stringify(payload));
            return {
                ...state,
                loading: false,
                cart: {
                    subtotal: payload.reduce((a, b) => a + b.price, 0),
                    gst: (payload.reduce((a, b) => a + b.price, 0)) * 0.05,
                    total: (payload.reduce((a, b) => a + b.price, 0)) * 1.05,
                    items: payload
                }
            }
        case REMOVE_CART:
            return {
                ...state,
                loading: false,
                cart: {
                    subtotal: payload.reduce((a, b) => a + b.price, 0),
                    gst: (payload.reduce((a, b) => a + b.price, 0)) * 0.05,
                    total: (payload.reduce((a, b) => a + b.price, 0)) * 1.05,
                    items: payload
                }
            }
        default:
            return state;
    }
}