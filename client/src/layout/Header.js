import React, { Fragment } from 'react';
import headerBackground from './headerBackground.mp4';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

const Header = ({ auth: { user, isAuthenticated } }) => {
    return (
        <header className='header'>
            <video className="header__video" autoPlay loop muted playsInline>
                <source src={headerBackground} type='video/mp4' />
            </video>
            <div className="header__hero">
                <h1>SUMMER SALE 25% OFF FOR FEMALE, MALE, KIDS, GOWNS AND BEAUTY PRODUCTS!!!</h1>
                {
                    !isAuthenticated && <Fragment>
                        <Link to='/signup' className='btn btn--tertiary mr'>Not a member yet? Sign up!</Link>
                        <Link to='/login' className='btn btn--primary'>Already a member? Login!</Link>
                    </Fragment>
                }
            </div>
        </header>
        
    )
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, {})(Header)
