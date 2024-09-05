const products = require("../models/products");
const asyncHandler = require("express-async-handler");


// Handle the "About Us" page
exports.about_get = asyncHandler(async (req, res) => {
  res.render('about', { title: 'About Us' });
});