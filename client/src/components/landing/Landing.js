import React, { Fragment, useEffect } from 'react';
import Header from '../../layout/Header';

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getAllProducts, addCart } from '../../actions/product';

const Products = ({ addCart, getAllProducts, product: { products, loading }, auth: { user, isAuthenticated } }) => {
    useEffect(() => {
        getAllProducts();
    }, [getAllProducts]);

    const onCategoryChange = (category) => {
        if(category) category = `category=${category}`;
        getAllProducts(category);
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

    const renderStarRating = (rating) => {
        let stars = [];
        for(let index = 0; index < Math.floor(rating); index++) {
            stars.unshift(<i key={index} className='fa fa-star' aria-hidden='true'></i>)
        }
        if(rating.toString().includes('.')) {
            parseInt(rating.toString().charAt(2)) >= 5 && stars.push((<i key='half' className='fa fa-star-half' aria-hidden='true'></i>));
        }
        return stars;
    }

    return (
        <Fragment>
            <Header />
            <div className='home'>
                {
                    isAuthenticated && <h1 className='heading-tertiary mb'>Hello {user.name}, check out our flash sale!!!</h1>
                }
                <div className='section category'>
                    <ul className='category__list'>
                        <li className='category__item'><Link to='#!' className='category__link' onClick={() => onCategoryChange('')}>All</Link></li>
                        <li className='category__item'><Link to='#!' className='category__link' onClick={() => onCategoryChange('kids')}>Kids</Link></li>
                        <li className='category__item'><Link to='#!' className='category__link' onClick={() => onCategoryChange('male')}>Male</Link></li>
                        <li className='category__item'><Link to='#!' className='category__link' onClick={() => onCategoryChange('female')}>Female</Link></li>
                        <li className='category__item'><Link to='#!' className='category__link' onClick={() => onCategoryChange('wedding')}>Wedding</Link></li>
                        <li className='category__item'><Link to='#!' className='category__link' onClick={() => onCategoryChange('beautyderm')}>Beautederm</Link></li>
                    </ul>
                </div>
                <section className='section product'>
                    {
                        loading ? <h1 className='heading-primary'> ... Loading </h1>
                        :
                        products.map(product => 
                            <Fragment key={product._id}>
                                <div className='product__card'>
                                    <div className='product__image-container'>
                                        <Link to={`/product/${product.slug}`}> 
                                            <img src={`/uploads/products/${product.image}`} alt={product.name} className='product__image' />
                                        </Link>
                                    </div>
                                    <div className='product__info'>
                                        <span className='product__name'>{product.name}</span>
                                        <span className='product__price'>CAD ${product.price}</span>
                                        <span className='product__review'>
                                            { renderStarRating(averageReview(product)) }
                                            ({product.review.length})
                                        </span>
                                    </div>
                                    <Link to='/#!' className='btn btn--primary btn-fluid' data-product-id={product._id} onClick={() => addCart(product)}>Add to cart</Link>
                                </div>
                            </Fragment>
                        )
                    }
                </section>
            </div>
        </Fragment>
    )
}


Products.propTypes = {
    product: PropTypes.object.isRequired,
    getAllProducts: PropTypes.func.isRequired,
    addCart: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    product: state.product,
    auth: state.auth
})

export default connect(mapStateToProps, { getAllProducts, addCart })(Products);