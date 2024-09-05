const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Define Frequency schema
const FrequencySchema = new Schema({
  frequency: {
    type: String,
    required: true,
  },
  channels: [
    {
      name: { type: String, required: true },
    },
  ],
  satelliteName: {
    type: String,  // Or, if you want to reference the Satellite model, use: type: Schema.Types.ObjectId, ref: 'Satellite'
    required: true,
  },
});

// Export model
module.exports = mongoose.model("frequency", FrequencySchema);
