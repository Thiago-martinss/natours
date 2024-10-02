const mongoose = require('mongoose');


const tourSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, trim: true },
    duration: { type: Number, required: true },
    maxGroupSize: { type: Number, required: true},
    difficulty: {
      type: String,
      required: true,
      //enum: ['easy', 'medium', 'hard'],
    },
    price: { type: Number, required: true },
    priceDiscount: { type: Number},
    summary: { type: String, trim: true, required: true },
    description: { type: String, trim: true },
    ratingsAverage: { type: Number, default: 5 },
    ratingsQuantity: { type: Number, default: 0 },
    imageCover:  { type: String, required: true },
    images:  [String],
    guides: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
    createdAt: { type: Date, default: Date.now, select: false },
    startDates: [Date],
  }, 
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

  tourSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7;
  }
  
  const Tour = mongoose.model('Tour', tourSchema);


  module.exports = Tour;