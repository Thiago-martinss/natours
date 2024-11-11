const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

const router = express.Router({mergeParams: true});



router.use(authController.protect);

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictTo('user'), 
    reviewController.setTourUserIds,
    reviewController.createReview
);



router.route('/:id')
.get(reviewController.getReview)
.patch(
  authController.restrictTo('user', 'admin'),  // only admin or user can update their own review
  reviewController.updateReview)
.delete(
  authController.restrictTo('user', 'admin'),  // only admin or user can delete their own review
  reviewController.deleteReview
)

  module.exports = router;
