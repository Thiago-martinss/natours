const mongoose = require('mongoose');
const Tour = require('./tourModel');


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

reviewSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'user',
        select: 'name photo'
    });
    next();
})

reviewSchema.statics.calcAverageRatings = async function(tourId) {
   const stats = await this.aggregate([
        { $match: { tour: tourId } },
        { $group: { _id: '$tour', nRating: {$sum: 1}, averageRating: { $avg: '$rating' } } }
    ]);
    console.log(stats)

    if(stats.length > 0) {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: stats[0].nRating,
            ratingsAverage: stats[0].averageRating
        });
        } else {
            await Tour.findByIdAndUpdate(tourId, { ratingsQuantity: 0, ratingsAverage: 4.5 });
        }
}

reviewSchema.post('save', function() {
    //this points to current review
    this.constructor.calcAverageRatings(this.tour);
});

reviewSchema.pre(/^findOneAnd/, async function(next) {
     this.r = await this.findOne()
     console.log(this.r);
})

reviewSchema.post(/^findOneAnd/, async function() {
    //await this.findOne(); does not work here, query has already executed
    await this.r.constructor.calcAverageRatings(this.r.tour)
})



const Review = mongoose.model('Review', reviewSchema);



module.exports = Review;


