const {promisify} = require('util');
jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const User = require('./../models/userModel');
const AppError = require('../utils/appError');

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
            passwordConfirm: req.body.passwordConfirm
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
     