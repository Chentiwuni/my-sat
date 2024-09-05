const { body, validationResult } = require('express-validator');
const newFrequency = require('../models/frequency');
const asyncHandler = require("express-async-handler");
const Satellite = require('../models/satellite');

  // Display frequency create form on GET.
exports.frequency_create_get = asyncHandler(async (req, res) => {
  const satellites = await Satellite.find(); // Fetch all satellites to display in a dropdown
  res.render('create_frequency', { title: 'Add New Frequency', satellite: satellites}); // Render the form template
});  
// POST /frequencies - Handle form submission and save new frequency to database
exports.frequency_create_post = [
  // Validate and sanitize fields
  body('frequency').trim().isLength({ min: 1 }).escape().withMessage('Frequency must be specified.'),
  body('channels').trim().isLength({ min: 1 }).escape().withMessage('At least one channel must be specified.'),
  body('satelliteName').trim().isLength({ min: 1 }).escape().withMessage('Satellite name must be specified.'),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    
    // Create Frequency object with sanitized data
    const frequency = new newFrequency({
      frequency: req.body.frequency,
      channels: req.body.channels.split(',').map(name => ({ name: name.trim() })),
      satelliteName: req.body.satelliteName,
    });

    if (!errors.isEmpty()) {
      const satellite = await Satellite.find(); // Fetch all satellites to re-render the form with options
      res.render('create_frequency', {
        title: 'Add New Frequency',
        frequency,
        errors: errors.array(),
        satellite,
      });
    } else {
      await frequency.save();
      res.redirect('/my-sat/frequency/create'); // Redirect to the list of frequencies after saving
    }
  }),
];
  
//GET request to manage frequencies
exports.manage_frequencies = asyncHandler(async (req, res, next) => {
  // Fetch all frequencies from the database
  const frequencies = await newFrequency.find();

  // Render the view with the frequencies data
  res.render("manage_frequencies", {
    title: "Manage Frequencies",
    frequencies: frequencies,
  });
});
  
// Display frequency delete form on GET.
exports.frequency_delete_get = asyncHandler(async (req, res) => {
  const frequency = await newFrequency.findById(req.params.id);
  if (!frequency) {
    res.status(404);
    throw new Error('Frequency not found');
  }
  res.render('delete_frequency', { frequency });
});


  // Handle frequency delete on POST.
  exports.frequency_delete_post = asyncHandler(async (req, res) => {
    await newFrequency.findByIdAndDelete(req.params.id).exec();
    res.redirect('/my-sat/manage_frequencies');
});  

  // Display frequency update form on GET.
  exports.frequency_update_get = asyncHandler(async (req, res) => {
    const frequency = await newFrequency.findById(req.params.id).exec();
    if (!frequency) {
        return res.status(404).send("Frequency not found");
    }

    res.render('edit_frequency', { title: 'Edit Frequency', frequency });
});
  
  // Handle frequency update on POST.
  exports.frequency_update_post = [
    // Validate and sanitize fields
    body('frequency', 'Frequency is required').trim().isLength({ min: 1 }).escape(),
    body('channels', 'Channels are required').trim().isLength({ min: 1 }).escape(),

    asyncHandler(async (req, res) => {
        const errors = validationResult(req);

        // Create a new Frequency object with escaped/trimmed data and old id
        const updatedFrequency = {
            frequency: req.body.frequency,
            channels: req.body.channels.split(',').map(name => ({ name: name.trim() })),
        };

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            return res.render('edit_frequency', { title: 'Edit Frequency', frequency: updatedFrequency, errors: errors.array() });
        } else {
            // Data from form is valid. Update the record.
            const frequency = await newFrequency.findByIdAndUpdate(req.params.id, updatedFrequency, {});
            res.redirect('/my-sat/manage_frequencies');
        }
    })
];