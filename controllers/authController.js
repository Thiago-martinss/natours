const crypto = require('crypto');
const {promisify} = require('util');
jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const User = require('./../models/userModel');
const AppError = require('../utils/appError');
const sendMail = require('../utils/email');

const signToken = id => {
   return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN   // 2 weeks
    })
} 


// create a new User
exports.signup = catchAsync (async (req, res, next) => {
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm,
            //role: req.body.role || 'user'  // default to user role if not provided in request body. 
        });
        
        const token = signToken(newUser._id);
       
        
        res.status(201).json({
            status: 'success',
            token,
            data: {
                user: newUser
            }
        });
});

exports.login =  catchAsync(async (req, res, next) => {
    const {email, password} = req.body;
    
    //1) Check if email and password exist
    if(!email || !password) {
      return next(new AppError(' Please provide a valid email and password', 400));
    
    }
    //2) Check if user exists and password is correct
    const user = await User.findOne({email}).select('+password');

    if(!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }
    
    
    // Create and send JWT
    const token = signToken(user._id);
    res.status(200).json({
        status:'success',
        token
    })
});

exports.protect = catchAsync(async (req, res, next) => {
    //1) Get token and check if it's there
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } 
    
    if(!token) {
        return next(new AppError('You are not logged in. Please log in to access this route.', 401));
    }
    
    //2) Verify token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    
    //3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if(!currentUser) {
        return next(new AppError('The user belonging to this token does no longer exist.', 401));
    }
    
    //4) Check if user changed password after token was issued
    if(currentUser.changedPasswordAfter(decoded.iat)) {
        return next(new AppError('User has changed their password. Please log in again.', 401));
    }
    
    // Grant access to protected route
    req.user = currentUser;
    res.locals.user = currentUser;  // make user available in req.body for other middleware functions
    next();
});

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
    // Check if user role matches the required role
        if(!roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission to perform this action.', 403));
        }
        next();
    };
};

exports.forgotPassword = catchAsync (async (req, res , next) => {
    // Get user based on provided email
    const user = await User.findOne({email: req.body.email});
    if(!user) {
        return next(new AppError('No user found with that email.', 404));
    };
    
    // Generate random token
    const resetToken = user.createPasswordResetToken();
    await user.save({validateBeforeSave: false});

    // Send reset token via email
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
    const message = `You are receiving this email because you (or someone else) 
    have requested a password reset for your account.\n\nPlease click on the following 
    link to reset your password:\n${resetURL}\n\nIf you did not request a password reset, 
    please ignore this email and no changes will be made.\n`;

    try {
        await sendEmail({
            to: user.email,
            subject: 'Password Reset Request',
            message
        });
    
        res.status(200).json({
            status:'success',
            message: 'Token sent to email'
        });
    } catch(err) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save({validateBeforeSave: false});

        return next(new AppError('There was an error sending email. Please try again later.', 500));
    }

 
});

exports.resetPassword =  catchAsync(async(req, res, next) => {
    // Get user based on the token
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
        passwordResetToken: hashedToken, 
        passwordResetExpires: {$gt: Date.now()}
    });
    
    // If token is invalid, return an error
    if(!user) {
        return next(new AppError('Invalid token or token has expired.', 400));
    }
    
    // Set new password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    
    // Log the user in
    const updatedUser = await User.findById(user._id).select('+password');
    const token = signToken(updatedUser._id);
    
    res.status(200).json({
        status:'sucess',
        message: 'User saved successfully'
    });
});
