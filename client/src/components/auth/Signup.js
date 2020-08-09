import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';

import PropTypes from 'prop-types';

import { signup } from '../../actions/auth';

const Signup = ({ signup, isAuthenticated }) => {

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        passwordConfirm: ''
    });

    const onInputChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const onFormSubmit = e => {
        e.preventDefault();
        signup(formData);
    }
    if(isAuthenticated) {
        return <Redirect to='/account' />
    }
    
    return (
        <section className='section container section-auth'>
            <h1 className='heading-primary'>Sign up</h1>
            <span>Already have an account? <Link to="/login" className='link'>login now!</Link></span>
            <form action="#" className='form form--login' onSubmit={onFormSubmit} >
                <div className="form__group">
                    <label htmlFor="name" className="form__label">Name</label>
                    <input type="text" id='name' name='name' className="form__input" onChange={e => onInputChange(e)} />
                </div>
                <div className="form__group">
                    <label htmlFor="email" className="form__label">Email</label>
                    <input type="text" id='email' name='email' className="form__input" onChange={e => onInputChange(e)} />
                </div>
                <div className="form__group">
                    <label htmlFor="password" className="form__label">Password</label>
                    <input type="password" id='password' name='password' className="form__input" onChange={e => onInputChange(e)} />
                </div>
                <div className="form__group">
                    <label htmlFor="passwordConfirm" className="form__label">Confirm Password</label>
                    <input type="password" id='passwordConfirm' name='passwordConfirm' className="form__input" onChange={e => onInputChange(e)} />
                </div>
                <input type="submit" value="Login" className='btn btn--primary btn--sm' />
            </form>
        </section>
    )
}

Signup.propTypes = {
    signup: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
})

export default connect(mapStateToProps, { signup })(Signup);
