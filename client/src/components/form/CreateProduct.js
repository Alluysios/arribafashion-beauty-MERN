import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { createProduct } from '../../actions/product';
import { Link } from 'react-router-dom';

const CreateProduct = ({ createProduct }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: 'beautederm',
        featured: false,
        sale: false,
        price: null,
        image: '',
        images: []
    });

    const onInputChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const onCheckboxChange = e => {
        const value = e.target.name === 'sale' || e.target.name === 'featured' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value })
    }

    const onFileChange = e => {
        if(e.target.name === 'image') {
            setFormData({ ...formData, [e.target.name]: e.target.files[0] })
        }

        if(e.target.name === 'images') {
            setFormData({ ...formData, [e.target.name]: e.target.files })
        }
    }

    const { name, description, category, price, featured, sale, image, images } = formData;

    const onFormSubmit = e => {
        e.preventDefault();
        let productFormData = new FormData();
        productFormData.append('name', name);
        productFormData.append('description', description);
        productFormData.append('category', category);
        productFormData.append('price', price);
        productFormData.append('featured', featured);
        productFormData.append('sale', sale);
        productFormData.append('image', image);
        for(const key of Object.keys(images)) {
            productFormData.append('images', images[key]);
        }
        createProduct(productFormData);
    }

    return (
        <section className='container'>
            <Link to='/admin' className='btn btn--secondary'>Admin &larr;</Link>
            <h1 className='heading-primary'>Create Product</h1>
            <form action='#' className='form form--product' onSubmit={onFormSubmit}>
                <div className='form__group'>
                    <label for='name' className='form__label'>Name</label>
                    <input type='text' id='name' name='name' className='form__input' onChange={e => onInputChange(e)} />
                </div>
                <div className='form__group'>
                    <label for='description' className='form__label'>Description</label>
                    <textarea name='description' id='description' className='form__input' cols='30' rows='10' onChange={e => onInputChange(e)} ></textarea>
                </div>
                <label htmlFor='category' className='form__label'>Category:</label>
                <select name='category' id='category' onChange={e => onInputChange(e)} >
                    <option value='kids'>kids</option>
                    <option value='male'>male</option>
                    <option value='female'>female</option>
                    <option value='gowns'>gowns</option>
                    <option value='beautyderm'>beautederm</option>
                </select>
                <div className='form__group'>
                    <label for='price' className='form__label'>price</label>
                    <input type='number' id='price' name='price' className='form__input' onChange={e => onInputChange(e)} />
                </div>
                <div className='form__group'>
                    <label for='featured' className='form__label'>featured?</label>
                    <input type='checkbox' id='featured' name='featured' checked={formData.featured} onChange={e => onCheckboxChange(e)} />
                </div>
                <div className='form__group'>
                    <label for='sale' className='form__label'>on sale?</label>
                    <input type='checkbox' id='sale' name='sale' checked={formData.sale} onChange={e => onCheckboxChange(e)}  />
                </div>
                <div className='form__group'>
                    <label for='image' className='form__label'>image:</label>
                    <input type='file' id='image' name='image' onChange={e => onFileChange(e)} />
                </div>
                <div className='form__group'>
                    <label for='images' className='form__label'>images:</label>
                    <input type='file' id='images' name='images' onChange={e => onFileChange(e)} multiple />
                </div>
                <input type='submit' className='btn btn--primary' value='Create' />
            </form>
        </section>
    )
}


CreateProduct.propTypes = {
    createProduct: PropTypes.func.isRequired,
}


export default connect(null, { createProduct })(CreateProduct);