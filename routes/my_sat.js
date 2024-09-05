// Require controller modules.
const satellites_controller = require("../controllers/satellite");
const products_controller = require("../controllers/products");
const frequencies_controller = require("../controllers/frequency");
const index_controller = require("../controllers/index");
const about_controller = require("../controllers/about");
const admin_controller = require("../controllers/admin");
const isAdminAuthenticated = require('../middleware/auth');
const express = require("express");
const router = express.Router();

/* GET home page. */
router.get("/", index_controller.index);

/* GET about page. */
router.get("/about", about_controller.about_get);

/// SATELLITE ROUTES ///

// GET request for displaying all satellites list page
router.get("/track_satellite", satellites_controller.track_satellite);

// GET request for displaying specif satellite page
router.get("/track_satellite/:id", satellites_controller.detail_satellite);

// GET request for creating satellite.
router.get("/satellite/create", satellites_controller.satellite_create_get);

// POST request for creating satellite.
router.post("/satellite/create", satellites_controller.satellite_create_post);

// GET request to delete satellite.
router.get("/satellite/:id/delete", satellites_controller.satellite_delete_get);


// POST request to delete satellite.
router.post("/satellite/:id/delete", satellites_controller.satellite_delete_post);

// GET request to update satellite.
router.get("/satellite/:id/update", satellites_controller.satellite_update_get);

// POST request to update satellite.
router.post("/satellite/:id/update", satellites_controller.satellite_update_post);

router.get("/manage_satellites", isAdminAuthenticated, satellites_controller.manage_satellites_get);

//ROOUTES FOR PRODUCTS//

// GET request for creating product.
router.get("/product/create", isAdminAuthenticated, products_controller.product_create_get);

// POST request for creating product.
router.post("/product/create", isAdminAuthenticated, products_controller.product_create_post);

// Get request for managing products.
router.get("/manage_products", isAdminAuthenticated, products_controller.manage_products);

// GET request to delete product.
router.get("/product/:id/delete", isAdminAuthenticated, products_controller.product_delete_get);

// POST request to delete product.
router.post("/product/:id/delete", isAdminAuthenticated, products_controller.product_delete_post);

// GET request to update product.
router.get("/product/:id/update", isAdminAuthenticated, products_controller.product_update_get);

// POST request to update product.
router.post("/product/:id/update", isAdminAuthenticated, products_controller.product_update_post);

//GET request for displaying product detail page
router.get("/product/:id", products_controller.product_detail);

//ROUTES FOR FREQUENCIES//

// GET request for creating frequency.
router.get("/frequency/create", isAdminAuthenticated, frequencies_controller.frequency_create_get);
//GET request for managing frequencies
router.get("/manage_frequencies", isAdminAuthenticated, frequencies_controller.manage_frequencies);

// POST request for creating frequency.
router.post("/frequency/create", isAdminAuthenticated, frequencies_controller.frequency_create_post);

// GET request to delete frequency.
router.get("/frequency/:id/delete", isAdminAuthenticated, frequencies_controller.frequency_delete_get);

// POST request to delete frequency.
router.post("/frequency/:id/delete", isAdminAuthenticated, frequencies_controller.frequency_delete_post);

// GET request to update frequency.
router.get("/frequency/:id/update", isAdminAuthenticated, frequencies_controller.frequency_update_get);

// POST request to update frequency.
router.post("/frequency/:id/update", isAdminAuthenticated, frequencies_controller.frequency_update_post);

//ROUTES FOR ADMIN LOGIN//

// GET request for admin login.
router.get("/admin_login", admin_controller.admin_login_get);

// POST request for admin login.
router.post("/admin_login", admin_controller.admin_login_post);

//GET request for admin logout
router.get("/admin_logout", isAdminAuthenticated, admin_controller.admin_logout_get);

// GET request for creating new admin.
router.get("/create_admin", isAdminAuthenticated, admin_controller.create_admin_get);

// POST request for creating new admin.
router.post("/create_admin", isAdminAuthenticated, admin_controller.create_admin_post);

// GET request for admin dashboard
router.get("/admin/dashboard", isAdminAuthenticated, admin_controller.admin_dashboard);

//GET request for managing admins
router.get("/manage_admins", isAdminAuthenticated, admin_controller.manage_admins);

// GET request for creating new admin.
router.get("/admin/:id/delete", isAdminAuthenticated, admin_controller.admin_delete_get);


// POST request for creating new admin.
router.post("/admin/:id/delete", isAdminAuthenticated, admin_controller.admin_delete_post);

//GET request for editing an admin
router.get("/admin/:id/update", isAdminAuthenticated, admin_controller.update_admin_get);

//POST request for updating an admin
router.post("/admin/:id/update", isAdminAuthenticated, admin_controller.update_admin_post);



module.exports = router;