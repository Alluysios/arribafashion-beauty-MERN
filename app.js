const path = require('path');
const express = require('express');
const app = express();
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');

const AppError = require('./api/utils/appError');
const globalErrorHandler = require('./api/controllers/errorHandlers');

const productRoutes  = require('./api/routes/productRoutes');
const reviewRoutes  = require('./api/routes/reviewRoutes');
const userRoutes = require('./api/routes/userRoutes');

const productController = require('./api/controllers/productController');

// set http security headers
app.use(helmet())

app.enable('trust proxy');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'))

// IMPLEMENT CORS
app.use(cors());
// Access-Control-ALlow-Origin
app.options('*', cors());
// app.options('/api/v1/products/:pid', cors())

if (process.env.NODE_ENV === 'development') { app.use(morgan('dev')); }
app.post('/webhook-checkout', express.raw({ type: 'application/json' }), productController.webhookCheckout);

// serving static files
app.use('/uploads', express.static('uploads'));
// body parser, ready data from body
app.use(express.json({ limit: '10kb' }));
app.use((req, res, next) => {
    // for middleware testing
    next();
});

// limit the request prevent attackers from guessing
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many request from this IP, please try again in an hour!'
});

// Sanitize data against NoSQL query injection
app.use(mongoSanitize());
// Data sanitize against xss
app.use(xss());
// Prevent parameter pollution (1 >) (ex: price=250, price=200)
app.use(
    hpp({
        whitelist: [
            'price',
            'name'
        ]
    })
);
app.use('/api', limiter);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/users', userRoutes);

app.all('*', (req, res, next) => {
    // const err = new Error(`Can't find ${req.originalUrl} on this server`);
    // err.status = 'fail';
    // err.statusCode = 404;
    
    // if we pass anything in next, express ill assume it's an error.
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404))
})

app.use(globalErrorHandler);

module.exports = app;