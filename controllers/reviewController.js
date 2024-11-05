const Review = require('./../models/reviewModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getReview = catchAsync(async (req, res, next)  => {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
        return next(new AppError('No review found with that ID', 404));
    }
    
    res.status(200).json({
        status: 'success',
        results: review.length,
        data: {
          review
        }
      });
});

exports.getAllReviews = catchAsync(async (req, res, next) => {
    const reviews = await Review.find();

    res.status(200).json({
        status: 'success',
        results: reviews.length,
        data: {
          reviews
        }
      });
});

exports.createReview = catchAsync(async (req, res, next) => {
    //req.body.tour = req.params.tourId;
    //req.body.user = req.user.id;
    
    const newReview = await Review.create(req.body);
    
    res.status(201).json({
        status: 'success',
        data: {
          review: newReview
        }
      });
    })