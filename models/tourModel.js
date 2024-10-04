const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');


const tourSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, trim: true, maxlength:40, minlength:10 },
    slug: String,
    startLocation: { type: String, required: true },
    locations: [
      {
    duration: { type: Number, required: true },
    maxGroupSize: { type: Number, required: true},
    difficulty: {
      type: String,
      required: true,
      enum: ['easy', 'medium', 'hard'],
    },
    price: { type: Number, required: true },
    priceDiscount: { type: Number,
      validate: {
        validator: function(val) {
        // this only points to current doc on NEW document creation
        return val < this.price
      },
      message:'Discount price ({VALUE}) should be below the regular price'
    },
    summary: { type: String, trim: true, required: true },
    description: { type: String, trim: true },
    ratingsAverage: { type: Number, default: 5},
    ratingsQuantity: { type: Number, default: 0 },
    imageCover:  { type: String, required: true },
    images:  [String],
    guides: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
    createdAt: { type: Date, default: Date.now, select: false },
    startDates: [Date],
    secretTour: { type: Boolean, default: false}
  }, 
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

  tourSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7;
  })
  

  // DOCUMENT MIDDLEWARE: runs before .save() and .create()
tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

tourSchema.pre('salve', function(next) {
  console.log('About to save a tour: ', this);
  next();
})

tourSchema.post('save', function(doc, next) {
  console.log('A new tour has been saved: ', doc);
  next();
});
  
// QUERY MIDDLEWARE
tourSchema.pre(/^find/, function(next) {
  this.find({ secretTour:  { $ne: true} });
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function(next) {
  console.log(`Querry took ${Date.now() - this.start} milliseconds!`)
  next();
});

// AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function(next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } }});
  next();
});

// EXPORT THE MODEL
const Tour = mongoose.model('Tour', tourSchema);


  module.exports = Tour;
