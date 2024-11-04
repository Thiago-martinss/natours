const mongoose = require('mongoose');


const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, 'Review must have content'],
        maxlength: [500, 'Review must have less or equal to 500 characters']
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, 'Review must have a rating']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
},
    {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
    }
);

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;