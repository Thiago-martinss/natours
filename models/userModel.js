const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'User must have a name'],
        trim: true,
        minlength: 2,
        maxlength: 30
    },
    email: {
        type: String,
        required: [true, 'User must have an email'],
        unique: true,
        lowercase: true,
        validate: [validateEmail, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: [true, 'User must have a password'],
        minlength: 8
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: [validatePasswordConfirm, 'Passwords do not match']
    },
    photo: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;