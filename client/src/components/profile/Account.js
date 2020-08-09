import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { updateProfile, updatePassword } from '../../actions/auth'

const Account = ({ auth: { user }, updateProfile, updatePassword }) => {
    const [formData, setFormData] = useState({
        email: '',
        name: ''
    });

    const onInputChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleProfileSubmit = e => {
        e.preventDefault();
        updateProfile(formData);
    }

    const handlePasswordSubmit = e => {
        e.preventDefault();
        updatePassword(formData);
    }

    return (
        <section className='container'>
            {
                user === null ? <h1 className='heading-primary'>LOADING...</h1>
                :
                <Fragment>
                    {
                        user && user.role === 'admin' && <Fragment> 
                            <Link to='/admin' className='btn btn--primary'> Admin </Link>
                        </Fragment>
                    }
                    <h1 className='heading-primary'>Hello {user.name}</h1>
                    <form action='#' className='form form--account' onSubmit={handleProfileSubmit}>
                        <div className='form__group'>
                            <label htmlFor='email' className='form__label'>Email</label>
                            <input type='text' id='email' name='email' className='form__input' placeholder={user.email} onChange={e => onInputChange(e)} />
                        </div>
                        <div className='form__group'>
                            <label htmlFor='description' className='form__label'>Name</label>
                            <input type='text' id='name' name='name' className='form__input' placeholder={user.name} onChange={e => onInputChange(e)} />
                        </div>
                        <input type='submit' className='btn btn--primary' value='Update' />
                    </form>

                    <form action='#' className='form form--account' onSubmit={handlePasswordSubmit}>
                        <div className='form__group'>
                            <label htmlFor='passwordCurrent' className='form__label'>Current Password</label>
                            <input type='password' id='passwordCurrent' name='passwordCurrent' className='form__input' placeholder='*******' onChange={e => onInputChange(e)} />
                        </div>
                        <div className='form__group'>
                            <label htmlFor='password' className='form__label'>New Password</label>
                            <input type='password' id='password' name='password' className='form__input' placeholder='*******' onChange={e => onInputChange(e)} />
                        </div>
                        <div className='form__group'>
                            <label htmlFor='passwordConfirm' className='form__label'>Password Confirm</label>
                            <input type='password' id='passwordConfirm' name='passwordConfirm' className='form__input' placeholder='*******' onChange={e => onInputChange(e)} />
                        </div>
                        <input type='submit' className='btn btn--primary' value='Change Password' />
                    </form>
                </Fragment>
            }
        </section>
    )
}

Account.propTypes = {
    auth: PropTypes.object.isRequired,
    updateProfile: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps, { updateProfile, updatePassword })(Account);