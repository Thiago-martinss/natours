const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
        validate: [validator.isEmail, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: [true, 'User must have a password'],
        minlength: 8
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate:  {
            validator: function(el) {
            return el === this.password;
            },
            message: 'Passwords do not match'
        }
    },
    photo: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hashing password before saving it to the database

userSchema.pre('save', async function(next) {
    // Only run this function if password was actually modified
    if (!this.isModified('password')) return next();

    // Hash the password using bcrypt
    this.password = await bcrypt.hash(this.password, 12);
    // Delete the passwordConfirm field after hashing it
    this.passwordConfirm = undefined;
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;