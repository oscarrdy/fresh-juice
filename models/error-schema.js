// Imports
const mongoose = require("mongoose");



// Error Schema
const ErrorSchema = new mongoose.Schema({
  message: {
    type: String,
  },
  error: {
    type: Object,
  },
}, {
  timestamps: true,
});

const Error = mongoose.model("Error", ErrorSchema);



// Exports
module.exports = Error;