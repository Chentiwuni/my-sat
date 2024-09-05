const { body, validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const Admin = require('../models/admin'); 



// Display the admin login page
exports.admin_login_get = (req, res) => {
  res.render('admin_login', { title: 'Admin Login' });
};

// Handle admin login
exports.admin_login_post = [
    // Validate and sanitize fields
    body("username", "username must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),

    body("password", "password must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  
    asyncHandler(async (req, res) => {
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        return res.render('admin_login', { 
          title: 'Admin Login', 
          errors: errors.array() 
        });
      }
  
      const { username, password } = req.body;
      const admin = await Admin.findOne({ username });
  
      if (!admin) {
        return res.render('admin_login', { 
          error: 'Invalid username or password', 
          title: 'Admin Login' 
        });
      }
  
      const isMatch = await bcrypt.compare(password, admin.password);
  
      if (!isMatch) {
        return res.render('admin_login', { 
          error: 'Invalid username or password', 
          title: 'Admin Login' 
        });
      }
  
      // If login is successful, set up session and redirect to the admin dashboard
      req.session.admin = admin._id;
      res.redirect('/my-sat/admin/dashboard');
    })
  ];

//admin logout
exports.admin_logout_get = (req, res) => {
  // Destroy the session and redirect to the login page
  req.session.destroy((err) => {
    if (err) {
      return res.redirect('/my-sat/admin_dashboard'); // Redirect to dashboard if logout fails
    }
    res.redirect('/my-sat/admin_login'); // Redirect to login on successful logout
  });
};

  // admin dashboard
exports.admin_dashboard = (req, res) => {
    res.render('admin_dashboard', {title: "Dashboard"});
  };
 
// Display admin registration form on GET
exports.create_admin_get = (req, res) => {
    res.render('create_admin', { title: 'Register New Admin' });
  };
  

// Handle admin registration on POST
exports.create_admin_post = [
  // Validate and sanitize fields
  body('username', 'Username must contain at least 3 characters')
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body('password', 'Password must contain at least 6 characters')
    .trim()
    .isLength({ min: 6 })
    .escape(),
  body('confirmPassword')
    .trim()
    .isLength({ min: 6 })
    .escape()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    }),

  // Process the request after validation and sanitization
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.
      return res.render('create_admin', {
        title: 'Register New Admin',
        admin: req.body,
        errors: errors.array(),
      });
    }

    // Check if username already exists
    const existingAdmin = await Admin.findOne({ username: req.body.username });
    if (existingAdmin) {
      return res.render('create_admin', {
        title: 'Register New Admin',
        admin: req.body,
        error: 'Username already exists',
      });
    }

    // Create a new admin with the hashed password
    const newAdmin = new Admin({
      username: req.body.username,
      password: req.body.password, // This will be hashed in the pre-save hook
    });

    // Save the admin to the database
    await newAdmin.save();

    // Redirect to admin login page after successful registration
    res.redirect('/my-sat/admin_login');
  }),
];

//  GET request for managing admins
exports.manage_admins = asyncHandler(async (req, res) => {
  const admins = await Admin.find({});
  res.render('manage_admins', { title: 'Manage Admins', admins });
});

// Display GET form to edit a specific admin
exports.update_admin_get = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.params.id);
  if (!admin) {
      return res.redirect('/my-sat/manage_admins');
  }
  res.render('admin_update', { title: 'update Admin', admin });
});

// POST request for updating an admin
exports.update_admin_post = [
  //sanitize user name and password
  body('username')
  .optional()
  .trim()
  .isLength({ min: 3 })
  .escape()
  .withMessage('Username must contain at least 3 characters'),

body('password')
  .optional()
  .trim()
  .isLength({ min: 6 })
  .escape()
  .withMessage('Password must contain at least 6 characters'),  asyncHandler(async (req, res) => {
    
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.render('admin_edit', {
        title: 'Edit Admin',
        errors: errors.array(),
        admin: req.body // You might want to render the current admin data here as well
      });
    }

    const admin = await Admin.findById(req.params.id);

    if (!admin) {
      return res.status(404).send('Admin not found');
    }

    if (req.body.username) {
      admin.username = req.body.username;
    }

    // Update password only if a new password is provided
    if (req.body.password) {
      admin.password = req.body.password; // This will be hashed in the pre-save hook
    }

    await admin.save();
    res.redirect('/my-sat/manage_admins');
  })
];

// Display Admin delete form on GET.
exports.admin_delete_get = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.params.id);
  if (!admin) {
    res.status(404);
    throw new Error('Admin not found');
  }
  res.render('admin_delete', { admin });
});


// Handle admin deletion
exports.admin_delete_post = asyncHandler(async (req, res) => {
  await Admin.findByIdAndDelete(req.params.id);
  res.redirect('/my-sat/manage_admins');
});

