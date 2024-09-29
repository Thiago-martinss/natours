const mongoose = require('mongoose');


const tourSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    duration: { type: Number, required: true },
    difficulty: {
      type: String,
      required: true,
      enum: ['easy', 'medium', 'hard'],
    },
    price: { type: Number, required: true },
    description: { type: String },
    rating: { type: Number, default: 0 },
    ratingsQuantity: { type: Number, default: 0 },
    //images:  [String],
    createdAt: { type: Date, default: Date.now },
    startDate: { type: Date },
  });
  
  const Tour = mongoose.model('Tour', tourSchema);


  module.exports = Tour;