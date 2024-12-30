// Imports
const mongoose = require("mongoose");



// Review Schema
const ReviewSchema = new mongoose.Schema({
  order_id: { 
    type: String, 
    required: true,
  },
  name: { 
    type: String, 
    required: true,
  },
  rating: { 
    type: Number, 
    required: true,
  },
  review: { 
    type: String, 
    required: true,
  },
  hasImg: { 
    type: Boolean, 
    required: true,
  },
  imgSizeOriginal: { 
    type: Number,
  },
  imgSizeCompressed: {
    type: Number,
  },
  img: { 
    data: Buffer,
    contentType: String,
  },
  isShown: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

const Review = mongoose.model("Review", ReviewSchema);



// Exports
module.exports = Review;