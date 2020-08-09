import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { login } from '../../actions/auth';

const Login = ({ login, isAuthenticated }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const onInputChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const onFormSubmit = e => {
        e.preventDefault();
        login(formData);
    }
    if(isAuthenticated) {
        return <Redirect to='/account' />
    }
    return (
        <section className='section container section-auth'>
            <h1 className='heading-primary'>Login</h1>
            <span>don't have an account? <Link to="/signup" className='link'>sign up now!</Link></span>
            <form action="#" className='form form--login' onSubmit={e => onFormSubmit(e)}>
                <div className="form__group">
                    <label htmlFor="email" className="form__label">Email</label>
                    <input type="text" id='email' name='email' className="form__input" onChange={e => onInputChange(e)} />
                </div>
                <div className="form__group">
                    <label htmlFor="password" className="form__label">Password</label>
                    <input type="password" id='password' name='password' className="form__input"  onChange={e => onInputChange(e)} />
                </div>
                <input type="submit" value="Login" className='btn btn--primary btn--sm' />
            </form>
        </section>
    )
}

Login.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    login: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, { login })(Login);
