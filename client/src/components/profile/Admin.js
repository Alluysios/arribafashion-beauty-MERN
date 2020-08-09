import React, { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { deleteProduct, getAllProducts } from '../../actions/product';

const Admin = ({ product: { products }, deleteProduct, getAllProducts }) => {
    useEffect(() => {
        getAllProducts();
    }, [getAllProducts]);

    const handleDeleteEvent = (pid) => {
        deleteProduct(pid);
    }

    return (
        <section className='admin'>
            <div className='group-text'>
                <h1 className='heading-primary'>Products</h1>
                <Link to='/admin/createProduct' className='btn btn--secondary'>Create</Link>
            </div>
            
            <table className='table'>
                <tr>
                    <th>Name</th>
                    <th>Price</th>
                    <th className='hide-sm-t'>reviews</th>
                    <th className='hide-sm-t'>category</th>
                    <th className='hide-sm-t'>sale</th>
                    <th className='hide-sm-t'>featured</th>
                    <th className='hide-sm-t'>Image</th>
                    <th></th>
                </tr>
                {
                    !products ? <h1 className='heading-primary'>Loading...</h1>
                    :
                    products.map(product => 
                        <Fragment>
                            <tr>
                                <td>{product.name}</td>
                                <td>{product.price}</td>
                                <td className='hide-sm-t'>{product.review && <Fragment>{product.review.length}</Fragment>}</td>
                                <td className='hide-sm-t'>{product.category}</td>
                                <td className='hide-sm-t'>{product.sale ? 'true' : 'false' }</td>
                                <td className='hide-sm-t'>{product.featured ? 'true' : 'false' }</td>
                                <td className='hide-sm-t'><img src={`/uploads/products/${product.image}`} alt={product.name} /></td>
                                <td>
                                    <Link to='#!' className='btn btn--delete' onClick={() => handleDeleteEvent(product._id)}>delete</Link>
                                    <Link to={`/admin/editProduct/${product.slug}`} className='btn btn--update'>Edit</Link>
                                </td>
                            </tr>
                        </Fragment>
                    )
                }
            </table>
        </section>
    )
}

Admin.propTypes = {
    product: PropTypes.object.isRequired,
    deleteProduct: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    product: state.product
})

export default connect(mapStateToProps, { deleteProduct, getAllProducts })(Admin);
