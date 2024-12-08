const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const Booking = require('../models/bookingModel');
const AppError = require('../utils/appError');


exports.getOverview = catchAsync(async (req, res, next) => {
    const tours = await Tour.find();
    res.status(200).render('overview', {
      title: 'All Tours',
      tours
    });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'reviews rating user',
  });
  if (!tour) {
    return next(new AppError('There is no tour with that name.', 404))
  }
  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "default-src 'self' https://*.mapbox.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
    )
    .render('tour', {
      title: `${tour.name}`,
      tour,
    });
});
 
exports.getLoginForm = catchAsync(async function(req, res) {
  res.status(200)
  .set(
    'Content-Security-Policy',
    "default-src 'self' https://*.mapbox.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
  )
  .render('login', {
    title: 'Login Screen' // or whatever title you wish
  });
});

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Account'
  });
};

exports.getMyTours = catchAsync(async(req, res, next) => {
  // Find all bookings
  const bookings = await Booking.find({ user: req.user._id });

  // Find all tours that match the booking IDs
  const tourIds = bookings.map(booking => booking.tour);
  const tours = await Tour.find({ _id: { $in: tourIds } });

  res.status(200).render('overview', {
    title: 'My Tours',
    tours
  });
});

exports.updatedUser = catchAsync( async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id, 
    {
      name: req.body.name,
      email: req.body.email
    },
    {
      new: true,
      runValidators: true
    }
  );

    res.status(200).render('account', {
      title: 'Account',
      user: updatedUser
    });
  });