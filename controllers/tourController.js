const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apifeatures');

export.aliasTopTours = (req, res, next) => {
 req.query.limit = '5';
 req.query.sort = '-ratingsAverage,price';
 req.query.fields = 'name,price,ratingsAverage,difficulty, summary';
 next();
}



exports.getAllTours  = async (req, res) => {
  try {
    //EXECUTE QUERY
    const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();    
    const tours = await features.query

    //SEND RESPONSE
    res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours
    }
  });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.getTour = async (req, res) => {
  try {
   const tour = await Tour.findById(req.params.id)

   res.status(200).json({
    status:'success',
    data: {
      tour
    }
   });
  } catch (err) {
    return res.status(404).json({
      status: 'fail',
      message: 'Tour not found'
    });
};
}

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body)
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour
        }
      });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
    }
}
 

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    });
  }catch {
    res.status(404).json({
      status: 'fail',
      message: 'Tour not found'
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id)
    res.status(204).json({
      status: 'success',
      data: null
    });
  }catch {
    res.status(404).json({
      status: 'fail',
      message: 'Tour not found'
    });
  }
 
};
