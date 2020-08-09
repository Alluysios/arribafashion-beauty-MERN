const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

exports.auth = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch(err) {
        console.log(err);
    }
}

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES
    })
}

const createSendToken = (user, statusCode, req, res) => {
    const token = signToken(user._id);

    // delete the user in the output
    user.password = undefined;

    res.status(statusCode).json({
        token,
        user
    });
}

exports.signup = catchAsync(async (req, res, next) => {
    if(req.body.password !== req.body.passwordConfirm) {
        return next(new AppError('Password not the same', 401));
    }
    // CHECK IF USER EXIST
    const user = await User.findOne({ email: req.body.email });
    if(user) {
        return next(new AppError('Email already exist', 400));
    }
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    })

    createSendToken(newUser, 201, req, res);
})

exports.login = catchAsync(async (req, res, next) => {
    const {email, password } = req.body;

    if (!email || !password) {
        return next(new AppError('Please provide email and passwiord', 400))
    }
    // check if user exists and password is correct
    const user = await User.findOne({ email }).select('+password');
    
    if(!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }

    createSendToken(user, 200, req, res);
});

exports.protect = catchAsync(async (req, res, next) => {
    let token;
    // Get token if exist
    if (req.headers.authorization && 
        req.headers.authorization.startsWith('Bearer'))
    {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }
    if (!token) {
        return next(new AppError('You\'re are not logged in! PLease log in to get access'));
    }
    // Verify the token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
    // Check if user still exist
    const currentUser = await User.findById(decoded.id);
    if(!currentUser) {
        return next(new AppError('The user belong to this token does no longer exist', 401));
    }

    // Check if user changed password after token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(new AppError('User recently changed password! Please give it a time.', 401));
    };
    // token = signToken(decoded.iat);

    // GRANT ACCESS PROTECTED ROUTE
    req.user = currentUser;
    next();
})

exports.onlyFor = (...roles) => {
    return (req, res, next) => {
        //roles
        if(!roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission to perform this action', 403));
        }
        next();
    }
}

exports.forgotPassword = catchAsync(async (req, res, next) => {
    // find user with email
    const user = await User.findOne({email: req.body.email});

    // check if there is a user with that email
    if(!user) {
        return next(new AppError('There is no user with that email addres', 404))
    }

    // create a temporary token using middleware
    const resetToken = user.createPasswordResetToken();
    await user.save();

    // send email to user
    const resetURL = `${req.protocol}://${req.get('host')}
        /api/v1/users/resetPassword/${resetToken}`;

    const message = `Forgot your password? Submit a PATCH request with your new password and password confirm to: ${resetURL}. If you didn't forget your password, please ignore this email.`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Your password reset token (valid for 10mins)',
            message
        })
    
        res.status(200).json({
            status: 'success',
            message: 'Token send to email'
        })
    } catch(err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;

        await user.save();
 
        return next(new AppError('There was an error sending the email. Try again later!', 500));
    }
})

exports.resetPassword = catchAsync(async(req, res, next) => {
    // get user based on the token
    const hasedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    console.log(hasedToken, 'comapre to password reset token')

    // get user with token and if token expiration still good
    const user = await User.findOne({
        passwordResetToken: hasedToken, 
        passwordResetExpires: { $gt: Date.now() }
    });

    // if token has not expired and there is user set the new password
    if (!user) {
        return next(new AppError('Token is invalid or has expired', 400));
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save({
        validateBeforeSave: true
    });

    // update changedPasswordAt (middleware)

    // log the user in
    createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
    // 1) Get user from collection
    const user = await User.findById(req.user.id).select('+password');
  
    // 2) Check if POSTed current password is correct
    if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
      return next(new AppError('Your current password is wrong.', 401));
    }
  
    // 3) If so, update password
    user.password = req.body.password;
    await user.save();
    // User.findByIdAndUpdate will NOT work as intended!
  
    // 4) Log user in, send JWT
    createSendToken(user, 200, req, res);
});