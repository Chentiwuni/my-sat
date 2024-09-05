const Product = require('../models/products');
const asyncHandler = require('express-async-handler');

// Controller function to handle the product listing page
exports.index = asyncHandler(async (req, res, next) => {
  // Fetch all products from the database
  const products = await Product.find({});
  
  // Render the 'index' view with the fetched products
  res.render('index', { title: "Home page", products });
});
