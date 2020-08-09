import React, { Fragment, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getProduct, addCart, rateProduct } from '../../actions/product';

const Product = ({ getProduct, product: { product, loading }, match, addCart, rateProduct, auth: { isAuthenticated } }) => {

    useEffect(() => {
        const slug = match.params.slug;
        getProduct(slug);
    }, [getProduct, match.params.slug]);

    const [formData, setFormData] = useState({
        review: '',
        rating: 1
    });
    
    const imagePreview = useRef(null);

    const handleImagePreview = e => {
        imagePreview.current.src = e.target.src;
    }

    const onInputChange = e => {
        setFormData({ ...formData, 
            [e.target.name]: 
            e.target.name === 'rating' ?
            Math.ceil(e.target.value) : e.target.value });
    }

    const onFormSubmit = e => {
        e.preventDefault();
        rateProduct(formData, product._id);
    }

    const renderStarRating = (rating) => {
        let stars = [];
        for(let index = 0; index < Math.floor(rating); index++) {
            stars.unshift(<i className='fa fa-star' aria-hidden='true'></i>)
        }
        if(rating.toString().includes('.')) {
            parseInt(rating.toString().charAt(2)) >= 5 && stars.push((<i className='fa fa-star-half' aria-hidden='true'></i>));
        }
        return stars;
    }

    const averageReview = (product) => {
        let reviewCount = product.review.length;
        let totalRating = 0;
        let averageRating = 0;
        for (let index = 0; index < reviewCount; index++) {
            totalRating += product.review[index].rating;
        }
        averageRating = Math.round((totalRating/reviewCount) * 100) / 100;
        return averageRating;
    }

    return (
        <section className='section container'>
            {
                product === null ? <h1 className="heading-primary"> Loading... </h1>
                :
                <Fragment>
                    <Link to='/' className='btn'>&larr; home</Link>
                    <div className='item'>
                        <div className='item__image-container'>
                            <img src={`/uploads/products/${product.image}`} alt={product.name} className='item__image' ref={imagePreview} />
                        </div>
                        <div className='item__image-list'>
                            <img src={`/uploads/products/${product.image}`} alt={product.name} onClick={e => handleImagePreview(e)} />
                            {
                                loading && product.images ? <div> loading... </div> : product.images.map((image, i) => 
                                    <Fragment key={i}>
                                        <img src={`/uploads/products/${image}`} alt={product.name} onClick={e => handleImagePreview(e)} />
                                    </Fragment>
                                )
                            }
                        </div>
                        <div className='item__info'>
                            <h2 className='heading-secondary'>{product.name}</h2>
                            <div className='item__price'>
                                <span>Price: CAD ${product.price}</span>
                            </div>
                            <div className='item__average-stars'>
                                <span>average reviews: </span>
                                { renderStarRating(averageReview(product)) }
                                {
                                    product.review.length === 0 ? 0 : `( ${averageReview(product)} )`
                                }
                            </div>

                            <div className='item__btn'>
                                <Link to='#!' className='btn btn--secondary' onClick={() => addCart(product)}>ADD TO CART</Link>
                                <Link to='/cart' className='btn btn--primary'>Checkout</Link>
                            </div>
                        </div>
                        <h2 className='heading-secondary'>Reviews</h2>
                        {
                            !isAuthenticated ? 
                            <h3 className="heading-tertiary">Write review! <Link className='btn btn--primary' to='login'>Login</Link></h3>
                            :
                            <Fragment>
                                <form action="#" className='form form--review' onSubmit={onFormSubmit}>
                                    <label htmlFor='review' className='form__label'>Review</label>
                                    <textarea name='review' id='review' className='form__input' onChange={e => onInputChange(e)} ></textarea>
                                    <div className="form__group">
                                        <label htmlFor='rating' className='form__label'>Rating (1 - 5): {' '}</label>
                                        <input type="number" name='rating' id='rating' min='1' max='5' onChange={e => onInputChange(e)} value={formData.rating} />
                                    </div>
                                    <input type="submit" className='btn btn--primary btn--sm' value='Write review' />
                                </form>
                            </Fragment>
                        }
                        <div className='item__reviews'>
                            {
                                product.review && product.review.map(rev => 
                                    <div className='reviews-container' key={rev._id}>
                                        <p className='item__reviews-name'>{rev.user.name}</p>
                                        <span>{rev.review}</span>
                                        <span className='item__reviews-stars'>
                                            {
                                                renderStarRating(rev.rating)
                                            }
                                        </span>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </Fragment>
            }
        </section>
    )
}

Product.propTypes ={
    getProduct: PropTypes.func.isRequired,
    product: PropTypes.object.isRequired,
    addCart: PropTypes.func.isRequired,
    rateProduct: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    product: state.product,
    auth: state.auth
})

export default connect(mapStateToProps, { getProduct, addCart, rateProduct })(Product);
