const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../models/tourModel');

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
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf8'));

//IMPORT DATA INTO DB
const importData = async () => {
    try {
        await Tour.create(tours);
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
