const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app');


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

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', () => {
  console.log('Unhandled rejection, shutting down...');
  server.close(() => {
    process.exit(1);
  });
});

process.on('uncaughtException', () => {
  console.log('Uncaught exception, shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
