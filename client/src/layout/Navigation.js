import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { useDispatch } from 'react-redux';

import Cookies from 'js-cookie';

import { getAllProducts } from '../actions/product';

const Navigation = ({ isAuthenticated, getAllProducts }) => {
    const dispatch = useDispatch();
    return (
        <nav className='navigation'>
            <div className="logo">
                <Link to='/'>
                    <h1 className='logo__main'>Arriba</h1>
                    <p className='logo__slogan'> <span className='fashion'>Fashion</span> & <span className='beauty'>Beauty</span></p>
                </Link>
            </div>
            <div className="navigation__dropdown" id='dropdown'>
                <Link to='/' className='navigation__menu'>
                    <span className='navigation__icon'></span>
                </Link>
            </div>
            {/* <ul className='navigation__list hide' id='nav-dropdown'>
                <li className='navigation__item'><Link to='/male' className="navigation__link">Male</Link></li>
                <li className='navigation__item'><Link to='/female' className="navigation__link">Female</Link></li>
                <li className='navigation__item'><Link to='/weddinggowns' className="navigation__link">Wedding Gowns</Link></li>
                <li className='navigation__item'><Link to='/beautyderm' className="navigation__link">Health/Beauty</Link></li>
            </ul> */}

            
            {
                isAuthenticated && Cookies.get('token') ? 
                <Fragment>
                    <ul className='navigation__list navigation__auth'>
                        <li className='navigation__item'><Link to='/cart'><i className="fa fa-shopping-cart" aria-hidden="true"></i></Link></li>
                        <li className='navigation__item'><Link to='/account'>Account</Link></li>
                        <li className='navigation__item'><Link to='/' onClick={() => dispatch({ type: 'LOGOUT' })}>Logout</Link></li>
                    </ul>
                </Fragment>
                :
                <Fragment>
                    <ul className='navigation__list navigation__auth'>
                        <li className='navigation__item'><Link to='/cart'><i className="fa fa-shopping-cart" aria-hidden="true"></i></Link></li>
                        <li className='navigation__item'><Link to='/login' className="navigation__link">Login</Link></li>
                        <li className='navigation__item'><Link to='/signup' className="navigation__link">Sign Up</Link></li>
                    </ul>
                </Fragment>
            }
        </nav>
    )
}

Navigation.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    getAllProducts: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, {getAllProducts})(Navigation);