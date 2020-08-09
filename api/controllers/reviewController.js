const Review = require('../models/reviewModel');
const Product = require('../models/productModel');

exports.setProductUserId = (req, res, next) => {
    // ALLOW NESTED ROUTES
    if(!req.body.product) req.body.product = req.params.productId;
    if(!req.body.user) req.body.user = req.user.id;
    next();
}

exports.getAllReviews = async(req, res, next) => {
    let filter = {}
    if(req.params.productId) filter = { product: req.params.productId }

    const reviews = await Review.find(filter);

    res.status(200).json({
        status: 'success',
        results: reviews.length,
        data: {
            reviews
        }
    })
}

exports.createReview = async(req, res, next) => {
    // const product = await Product.findById(req.params.productId).populate('review');
    // await Review.create(req.body);
    const product = await Product.findById(req.params.productId).populate('review');
    console.log(product.review);

    res.status(200).json({
        status: 'success',
        product
    })
}

exports.getReview = async(req, res, next) => {
    const review = await Review.findById(req.rid);

    res.status(200).json({
        status: 'success',
        data: {
            review
        }
    })
}