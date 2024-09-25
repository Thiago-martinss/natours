const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const app = express();

//1) MIDDLEWARES
app.use(morgan('dev'))
app.use(express.json());

app.use((req, res, next) => {
  console.log('Logging middleware...');
  next();
});

app.use((req, res, next) => {
  req.requesttIME = new Date().toISOString;
  next();
});

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

//2) ROUTES  HANDLERS
const getAllTours = (req, res) => {
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
};

  const getTour = (req, res) => {
    console.log(req.params);
    const id = req.params.id;
  
    const tour = tours.find((t) => t.id === parseInt(id));
  
    if (!tour) {
      return res.status(404).json({
        status: 'fail',
        message: 'Tour not found',
      });
    }
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  }

  (req, res) => {
  const newID = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newID }, req.body);

  tours.push(newTour);

  res.send('success');

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      if (err) console.error(err);
      status: 'success';
      data: {
        tour: newTour;
      }
    }
  );
}

const createTour = (req, res) => {
  const newID = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newID }, req.body);

  tours.push(newTour);

  res.send('success');

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      if (err) console.error(err);
      status: 'success';
      data: {
        tour: newTour;
      }
    }
  );
};
 
const updateTour = (req, res) => {
    if (req.params.id * 1 > tours.length) {
      return res.status(404).json({
        status: 'fail',
        message: 'Tour not found',
      });
    }
  
    res.status(200).json({
      status: 'success',
      data: {
        tour: '<Updated tour here...>',
      },
    });
};

const deleteTour = (req, res) => {
    if (req.params.id * 1 > tours.length) {
      return res.status(404).json({
        status: 'fail',
        message: 'Tour not found',
      });
    }
  
    res.status(200).json({
      status:'success',
      message: 'Tour deleted successfully',
    });
};

const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route not found',
});

const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route not found',
});

const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route not found',
});

const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route not found',
});

const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route not found',
});

//3)ROUTES
const tourRouter = express.Router();
const userRouter = express.Router();

tourRouter.route('/').get(getAllTours).post(createTour);
tourRouter.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

app.route('/api/v1/users').get(getAllUsers).post(createUser);
app.route('/api/v1/users/:id').get(getUser).patch(updateUser).delete(deleteUser);

userRouter.use('/', tourRouter)
userRouter.use('/:id', userRouter)

//4)START SERVER
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
})
