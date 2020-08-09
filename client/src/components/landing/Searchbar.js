import React, { Fragment } from 'react'

const Searchbar = () => {
    return (
        <Fragment>
            <form action="#" className='form form--search'>
                <input type="text" className="form__input" />
                <input type="button" value="Search" className='btn btn--primary' />
            </form>
        </Fragment>
    )
}

export default Searchbar;
