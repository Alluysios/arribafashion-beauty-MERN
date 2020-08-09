const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Product = require('./../models/productModel');
const User = require('./../models/userModel');
const PurchaseHistory = require('./../models/historyModel');
const APIFeatures = require('./../utils/apiFeatures');


const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const multer = require('multer');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');

// DIRECT
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, `public/img/products`);
//     },
//     filename: (req, file, cb) => {
//         const ext = file.mimetype.split('/')[1];
//         cb(null, `product-${Date.now()}.${ext}`);
//     }
// })

// BUFF
const storage = multer.memoryStorage();

// Check if file is image
const multerFilter = (req, file, cb) => {
    if(file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image!'), false);
    }
}

const upload = multer({ 
    storage: storage,
    fileFilter: multerFilter
});


exports.resizeUploadProducts = async(req, res, next) => {
    if(req.files.image) {
        req.body.image = `product-${Date.now()}.jpeg`;
    
        await sharp(req.files.image[0].buffer)
            .toFormat('jpeg')
            .jpeg({quality: 95})
            .toFile(`uploads/products/${req.body.image}`);
    }

    if (req.files.images) {
        req.body.images = [];

        await Promise.all(req.files.images.map(async(file, i) => {
            const filename = `product-${Date.now()}-showlist-${i + 1}.jpeg`;
    
            await sharp(file.buffer)
                .toFormat('jpeg')
                .jpeg({quality: 95})
                .toFile(`uploads/products/${filename}`)
    
            req.body.images.push(filename)
        }))
    }

    next();
};

exports.uploadProduct = upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'images', maxCount: 6 }
]);

exports.getAllProducts = async(req, res) => {
    let filter = {}
    const features = new APIFeatures(Product.find(filter), req.query)
        .filter()
        .sort()
        .limitFields();
    
    const products = await features.query.populate('review');

    res.status(200).json({
        status: 'success',
        results: products.length,
        products
    })
}

exports.getProduct = catchAsync(async(req, res, next) => {
    const product = await Product.findOne({ slug: req.params.slug }).populate('review');

    if (!product) {
        return next(new AppError('No product found with that NAME', 404));
    }

    res.status(200).json({
        status: 'success',
        product
    })
})

exports.createProduct = catchAsync(async(req, res, next) => {
    const product = await Product.create(req.body);

    res.status(201).json({
        status: 'success',
        product
    })
})

exports.updateProduct = catchAsync(async(req, res, next) => {
    const product = await Product.findByIdAndUpdate(req.params.pid, req.body, {
        new: true,
        runValidators: true
    });

    if (!product) {
        return next(new AppError('No product found with that ID', 404));
    }

    res.status(200).json({
        status: 'updated',
        product
    })
})

exports.deleteProduct = catchAsync(async(req, res, next) => {
    const product = await Product.findByIdAndDelete(req.params.pid);

    let filter = {}
    const features = new APIFeatures(Product.find(filter), req.query)
        .filter()
        .sort()
        .limitFields();

    const products = await features.query.populate('review');

    if (!product) {
        return next(new AppError('No product found with that ID', 404));
    }

    res.json({
        status: 'success',
        products
    })
})

// AGGREGRATIONS
exports.getProductsByCategory = async(req, res) => {
    const productsByCategories = await Product.aggregate([
        {
            $group: {
                _id: {$toUpper: '$category'},
                numProducts: { $sum: 1 },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' },
                avgPrice: { $avg: '$price'}
            }
        },
        {
            $sort: { avgPrice: 1 }
        }
    ]);

    res.status(200).json({
        status: 'success',
        data: {
            productsByCategories
        }
    });
};

exports.aliasCheapProducts = (req, res, next) => {
    req.query.field = 'name price category description';
    req.query.sort = 'price,name,category';
    req.query.limit = '5';
    next();
}

exports.cartCheckout = async(req, res) => {
    let error;
    let status;
    
    try {
        const { token, price } = req.body;

        const customer = await stripe.customers.create({
            email: token.email,
            source: token.id
        });

        const idempotency_key = uuidv4();
        const charge = await stripe.charges.create({
            amount: price * 100,
            currency: "cad",
            customer: customer.id,
            receipt_email: token.email,
            description: `Arriba Fashion and Beauty`,
            shipping: {
                name: token.card.name,
                address: {
                    line1: token.card.address_line1,
                    line2: token.card.address_line2,
                    city: token.card.address_city,
                    country: token.card.address_country,
                    postal_code: token.card.address_zip
                }
            }
        },
        {
            idempotency_key
        });
        // console.log('charge:', { charge });
        status = 'success';
    } catch (err) {
        console.error('Error', err);
        status = 'failure';
    }

    res.json({ error, status })
}


exports.webhookCheckout = (req, res, next) => {
    const signature = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed')
    createPurchaseProduct(event.data.object);

  res.status(200).json({ received: true });
};