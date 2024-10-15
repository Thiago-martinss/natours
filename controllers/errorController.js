const AppError = require('./../utils/AppError');

const handleDuplicateFieldsDB = err => {
  const message = `Duplicate field value: ${err.keyValue.name} already exists.`;
  return new AppError(message, 400);
};

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
  const message = Object.values(err.errors).map(el => el.message).join(', ');
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
}

const sendErrorProd = (err, res) => {
  if (err.iOperational) {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  });
} else {
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong, please try again later'
   });
 }
}

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
   sendErrorDev(err, res)
  } else if (process.env.NODE_ENV === 'production') {
    let error = {...err};

    if(error.name === 'CastError')  handleCastErrorDB(error);
    if (error.name === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);

    sendErrorPROD(error, res);
  }
};
