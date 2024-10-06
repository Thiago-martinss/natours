const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apifeatures');

exports.aliasTopTours = (req, res, next) => {
 req.query.limit = '5';
 req.query.sort = '-ratingsAverage,price';
 req.query.fields = 'name,price,ratingsAverage,difficulty, summary';
 next();
}



exports.getAllTours = async (req, res) => {
  try {
    // EXECUTE QUERY
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    // Tour.findOne({ _id: req.params.id })

    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

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

exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: {ratingsAverage: {$gte: 4.5}}
      },
      {
        $group: {
          _id: null,
          numTours: {$sum: 1},
          numRatings: {$sum: '$ratingsQuantity'},
          avgRating: {$avg: '$ratingsAverage'},
          avgPrice: {$avg: '$price'},
          minPrice: {$min: '$price'},
          maxPrice: {$max: '$price'}
        }
      }
      
    ]);
  } catch (e) {
    res.status(500).json({
      status: 'fail',
      message: 'Failed to retrieve stats'
    });  
  } 
}

exports.getMonthlyPlan = async(req, res) => {
  try {
    const year = parseInt(req.params.year);
    const plan = await Tour.aggregate([
      
      {
        unwind: '$startDates'
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: {
            month: {$month: '$startDates'}
          },
          numTours: {$sum: 1},
          tours: {$push: 'name'}
        }
      },
      {
      $addFields: { month: '$_id' },
      },
      {
        $project: {
          _id: 0
        }
      },
      {
        $sort: { numTourStarts: -1 }
      }
    ]);
  }catch(e) {
    res.status(404).json({
      status: 'fail',
      message: 'No tours found for the given location and year'
    });
  }
}