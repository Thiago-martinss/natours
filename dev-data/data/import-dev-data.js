const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../models/tourModel');
const Review = require('./../../models/reviewModel');
const User = require('./../../models/userModel');



dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace('<DATABASE_PASSWORD>');

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((con) => {
    console.log('MongoDB connected...');
  });

  // READ JSON FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf8'));


//IMPORT DATA INTO DB
const importData = async () => {
    try {
        await Tour.create(tours);
        await User.create(users, {validateBeforeSave: false});
        await Review.create(reviews);
        console.log('Data imported successfully...');
        process.exit();
        
    } catch (error) {
        console.error('Error importing data:', error);
        process.exit(1);
    }
};

// DELETE ALL DATA

const deleteData = async () => {
    try {
        await Tour.deleteMany();
        await User.deleteMany();
        await Review.deleteMany();

        console.log('Data deleted successfully...');
        process.exit();
        
    } catch (error) {
        console.error('Error deleting data:', error);
        process.exit(1);
    }
};

if(process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] === '--delete' ) {
    deleteData();
}
