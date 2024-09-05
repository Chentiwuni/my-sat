const { body, validationResult } = require('express-validator');
const products = require("../models/products");
const asyncHandler = require("express-async-handler");
const upload = require("../middleware/file_uploads");

//GET request for product detail page
exports.product_detail = asyncHandler(async (req, res, next) => {
  const productId = req.params.id;

  // Fetch the specific product by ID and all products from the database
  const [product, allProducts] = await Promise.all([
    products.findById(productId).exec(),
    products.find({}).exec(),
  ]);

  if (!product) {
    const err = new Error("Product not found");
    err.status = 404;
    return next(err);
  }

  // Render the view with both the specific product and all products
  res.render("product_detail", { title: 'product_detail', product, allProducts });
});

// Display Product create form on GET.
exports.product_create_get = asyncHandler(async (req, res, next) => {
  // Render the product form view with an empty product object
  res.render('product_create_form', { title: 'Add New Product', product: {} });
});

// Handle Product create on POST.
exports.product_create_post = [
// Upload the file
upload.single("image"),

  // Validate and sanitize fields.
  body('title', 'Title must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('price', 'Price must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('description', 'description must not be empty').trim().isLength({ min: 10 }).escape(),


  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Product object with escaped and trimmed data.
    const product = new products({
      title: req.body.title,
      price: req.body.price,
      description: req.body.description,
      image_url: req.file.filename,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render('product_create_form', {
        title: 'Add New Product',
        product: product,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid. Save product.
      await product.save();
      // Redirect back to the same product create page
      res.redirect('/my-sat/product/create');
    }
  }),
];


// Display product delete form on GET.
exports.product_delete_get = asyncHandler(async (req, res) => {
  const product = await products.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.render('delete_product', { product });
});

// Handle product delete on POST.
exports.product_delete_post = asyncHandler(async (req, res) => {
  const product = await products.findByIdAndDelete(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.redirect('/my-sat/manage_products');
});
// Display product update form on GET.
exports.product_update_get = asyncHandler(async (req, res) => {
  const product = await products.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.render('update_product', { product });
});

// Handle product update on POST.
exports.product_update_post = asyncHandler(async (req, res) => {
  const { title, description, price } = req.body;
  const product = await products.findByIdAndUpdate(
    req.params.id,
    { title, description, price },
    { new: true, runValidators: true }
  );
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.redirect('/my-sat/manage_products');
});

exports.manage_products = asyncHandler(async (req, res) => {
  const all_products = await products.find({});
  res.render('manage_products', { all_products });
});