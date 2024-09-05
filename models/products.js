const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  title: { type: String, required: true, maxLength: 30 },
  price: { type: String, required: true, maxLength: 30 },
  image_url: { type: String, required: true, maxLength: 100 },
  description: { type: String, required: true }
});

// Virtual for product's description URL
ProductSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/my-sat/product/${this._id}`;
});

// Export model
module.exports = mongoose.model("products", ProductSchema);
