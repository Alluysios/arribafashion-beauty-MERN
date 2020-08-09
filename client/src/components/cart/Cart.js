import React, { useEffect, Fragment } from 'react';
import { connect } from 'react-redux';

import { getAllProducts, removeCart } from '../../actions/product';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import StripeCheckOutButton from '../stripe-button/stripe-button';

const Cart = ({ product: { cart: { items } }, getAllProducts, removeCart }) => {
    useEffect(() => {
        getAllProducts();
    }, [getAllProducts]);

    return (
        <section className='section container cart'>
            <h1 className='heading-primary'>cart items</h1>
            {
                items.length === 0 ? <div>
                    <h1 className='heading-primary'>Nothing in cart :(( ... <Link to='/' className='btn btn--secondary'>Shop Now!</Link></h1>
                </div>
                :
                <Fragment>
                    {
                        items && items.map(product =>
                            <Fragment key={product._id+1}>
                                <div className="cart__items">
                                    <div className="cart__item">
                                        <div className="cart__image-container">
                                            <Link to={`/product/${product.slug}`}>
                                                <img className='cart__image' src={`/uploads/products/${product.image}`} alt={product.name} />
                                            </Link>
                                        </div>
                                        <div className="cart__info">
                                            <h2 className='heading-tertiary'> {product.name} </h2>
                                            <Link to="#!" className="btn btn--delete" onClick={() => removeCart(product._id)}>remove</Link>
                                        </div>
                                    </div>
                                </div>
                            </Fragment>
                        )
                    }
                    <div className="cart__checkout">
                        <div className='subtotal'>Subtotal: ${ items.reduce((a, b) => a + b.price, 0) } </div>
                        <div className='gst'>GST: $ { (items.reduce((a, b) => a + b.price, 0)) * 0.05 } </div>
                        <div className='total'>Total: <span className='price'>${ (items.reduce((a, b) => a + b.price, 0)) * 1.05 }</span></div>
                        {/* <Link to='#!' className="btn btn--primary">checkout</Link> */}
                        <div className="warning">
                            *This is a stripe test mode. Please use the following test credit cart for payments*
                            <br />
                            4242 4242 4242 4242 - Exp: 12/24 (any future date) - CVV: 123 (any 3 digits will work)
                        </div>
                        <div className="danger">
                            *This is a stripe test mode and portfolio showcase.<br />
                            In test mode: cart selections are shared in same device.<br />
                            In the future unauthenticated users won't be able to pay unless they login, a login button will pop up instead of pay* 
                        </div>
                        <StripeCheckOutButton price={(items.reduce((a, b) => a + b.price, 0)) * 1.05} />
                    </div>
                </Fragment>
            }
        </section>
    )
}

Cart.propTypes = {
    product: PropTypes.object.isRequired,
    getAllProducts: PropTypes.func.isRequired,
    cart: PropTypes.object,
}


const mapStateToProps = state => ({
    product: state.product
})

export default connect(mapStateToProps, { getAllProducts, removeCart })(Cart);