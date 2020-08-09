const express = require('express');
const viewController = require('./../controllers/viewController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.get('/', authController.isLoggedIn, viewController.getOverview);
router.get('/shop', authController.isLoggedIn, viewController.getShop);
router.get('/product/:slug', authController.isLoggedIn, viewController.getProduct);
router.get('/book', authController.isLoggedIn, viewController.getContactForm)
router.get('/myAccount', authController.isLoggedIn, viewController.getMyAccount)

router.get('/purchase-history', authController.protect, viewController.getPurchaseHistory);

module.exports = router;