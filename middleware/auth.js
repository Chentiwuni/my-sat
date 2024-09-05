// middleware/auth.js
function isAdminAuthenticated(req, res, next) {
    if (req.session && req.session.admin) {
      // The admin is authenticated, so proceed to the next middleware/route handler
      return next();
    } else {
      // The admin is not authenticated, redirect to the login page
      return res.redirect('/my-sat/admin_login');
    }
  }
  
  module.exports = isAdminAuthenticated;
  