const mongoose = require('mongoose')
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace('<DATABASE_PASSWORD>');

mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
}).then(con => {
  console.log('MongoDB connected...');
})

const tourSchema = new mongoose.Schema({
  name: { type: String, required: true },
  duration: { type: Number, required: true },
  difficulty: { type: String, required: true, enum: ['easy', 'medium', 'hard'] },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  rating: { type: Number, default: 0 },
  ratingsQuantity: { type: Number, default: 0 },
  //images: [String],
  createdAt: { type: Date, default: Date.now },
  startDate: { type: Date },
  secretTour: { type: Boolean, default: false }
});

const Tour = mongoose.model('Tour', tourSchema);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
})
