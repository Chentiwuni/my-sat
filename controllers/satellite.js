const { body, validationResult } = require("express-validator");
const Satellite = require("../models/satellite");
const Frequency = require("../models/frequency");
const asyncHandler = require("express-async-handler");

// GET: Display the list of satellites
exports.track_satellite = asyncHandler(async (req, res, next) => {
  const satellites = await Satellite.find().sort({ name: 1 }).exec();
  res.render('satellite_list', {
      title: 'Trackable Satellites',
      satellites: satellites,
  });
});

// GET controller to fetch and display frequencies for a specific satellite
exports.detail_satellite = asyncHandler(async (req, res) => {
  const satelliteId = req.params.id;

  // Fetch the satellite by ID
  const satellite = await Satellite.findById(satelliteId);
  
  if (!satellite) {
    return res.status(404).render('error', { title: 'Satellite Not Found', message: 'Satellite not found' });
  }

  // Fetch all frequencies associated with the satellite name
  const frequencies = await Frequency.find({ satelliteName: satellite.name });

  res.render('satellite_detail_page', { title: `Tracking ${satellite.name}`, satellite, frequencies });
});

// GET: Display form to add a new satellite
exports.satellite_create_get = asyncHandler(async (req, res, next) => {
  res.render('create_satellite', {
      title: 'Add New Satellite',
  });
}); 

// POST request for creating a new satellite
exports.satellite_create_post = [
  // Validate and sanitize fields
  body('name', 'Satellite name is required').trim().isLength({ min: 1 }).escape(),
  body('position', 'Satellite position is required').trim().isLength({ min: 1 }).escape(),
  body('description', 'Satellite description is required').trim().isLength({ min: 1 }).escape(),

  // Process request after validation and sanitization
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    // Extract validated data
    const { name, position, description } = req.body;

    if (!errors.isEmpty()) {
      // If there are validation errors, re-render the form with current data and errors
      return res.render('create_satellite', {
        title: 'Add New Satellite',
        satellite: { name, position, description },
        errors: errors.array(),
      });
    }

    // Create a new satellite with validated data
    const satellite = new Satellite({
      name,
      position,
      description,
    });

    // Save the satellite to the database
    await satellite.save();

    // Redirect to the manage satellites page after successful save
    res.redirect('/my-sat/satellite/create');
  })
];

   //GET REQUEST FOR MANAGING SATELLITES
   exports.manage_satellites_get = asyncHandler(async (req, res) => {
    const satellites = await Satellite.find({});
    res.render('manage_satellites', { title: 'Manage Satellites', satellites });
  });


// Display satellite delete form on GET.
exports.satellite_delete_get = asyncHandler(async (req, res) => {
  const satellite = await Satellite.findById(req.params.id);
  if (!satellite) {
    res.status(404);
    throw new Error('Satellite NOt Found');
  }
  res.render('delete_satellite', { satellite });
});  

  // Handle satellite delete on POST.
  exports.satellite_delete_post = asyncHandler(async (req, res) => {
    const satellite = await Satellite.findById(req.params.id);
  
    if (!satellite) {
      return res.status(404).send('Satellite not found');
    }
  
    // Delete all frequencies associated with the satellite
    await Frequency.deleteMany({ satelliteName: satellite.name });
  
    // Delete the satellite itself
    await satellite.deleteOne();
  
    res.redirect('/my-sat/manage_satellites');
  }); 

  // Display satellite update form on GET.
  exports.satellite_update_get = asyncHandler(async (req, res) => {
    const satellite = await Satellite.findById(req.params.id);
    if (!satellite) {
      return res.status(404).send('Satellite not found');
    }
    res.render('edit_satellite', { title: 'Edit Satellite', satellite });
  });
    
  // Handle satellite update on POST.
  exports.satellite_update_post = [
    body('name').trim().isLength({ min: 1 }).escape().withMessage('Satellite name required.'),
    body('position').trim().isNumeric().withMessage('Position must be a number.'),
    body('description').trim().isLength({ min: 1 }).escape().withMessage('Description required.'),
  
    asyncHandler(async (req, res) => {
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        return res.render('satellite_edit', {
          title: 'Edit Satellite',
          satellite: req.body,
          errors: errors.array(),
        });
      }
  
      const satellite = await Satellite.findById(req.params.id);
      if (!satellite) {
        return res.status(404).send('Satellite not found');
      }
  
      satellite.name = req.body.name;
      satellite.position = req.body.position;
      satellite.description = req.body.description;
  
      await satellite.save();
      res.redirect('/my-sat/manage_satellites');
    })
  ];
  