const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Schema = mongoose.Schema;

const AdminSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true, // Ensures the username is unique
  },
  password: {
    type: String,
    required: true,
  },
});

// Hash the password before saving the admin document
AdminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    // Hash the password with the salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('Admin', AdminSchema);
