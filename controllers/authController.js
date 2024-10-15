const catchAsync = require('../utils/catchAsync');
const User = require('./../models/userModel');


// create a new User
exports.signup = catchAsync (async (req, res, next) => {
        const newUser = await User.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                user: newUser
            }
        });
});