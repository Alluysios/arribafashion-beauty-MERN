import React, { Fragment, useEffect } from 'react';
import Navigation from '../layout/Navigation';
import Footer from '../layout/Footer';
import Landing from './landing/Landing';
import Login from './auth/Login';
import Signup from './auth/Signup';
import Product from './product/Product';
import CreateProduct from './form/CreateProduct';
import EditProduct from './form/EditProduct';
import Account from './profile/Account';
import Admin from './profile/Admin';
import Cart from './cart/Cart';


import { loadUser } from '../actions/auth';
import store from '../store';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import setAuthToken from '../helper/setAuthToken';
import Cookies from 'js-cookie';
import PrivateRoute from './auth/PrivateRoute';

if(Cookies.get('token')) {
    setAuthToken(Cookies.get('token'));
}

const App = () => {
    useEffect(() => {
        store.dispatch(loadUser());
    }, []);

    return (
        <Router>
            <Fragment>
                <Navigation />
                <Route exact path='/' component={Landing} />
                <Switch>
                    <Route exact path='/login' component={Login} />
                    <Route exact path='/signup' component={Signup} />
                    <PrivateRoute exact path='/account' component={Account} />
                    <PrivateRoute exact path='/admin' component={Admin} />
                    <PrivateRoute exact path='/admin/createProduct' component={CreateProduct} />
                    <PrivateRoute exact path='/admin/editProduct/:slug' component={EditProduct} />
                    <Route exact path='/cart' component={Cart} />
                    <Route exact path='/product/:slug' component={Product} />
                </Switch>
                <Footer />
            </Fragment>
        </Router>
    )
}


export default App;