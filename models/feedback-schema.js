// Imports
const mongoose = require("mongoose");



// Feedback Schema
const FeedbackSchema = new mongoose.Schema({
  q1: {
    type: Number,
  },
  q2: { 
    type: Number,
  },
  q3: { 
    type: Number,
  },
  q4: { 
    type: Number,
  },
  where: { 
    type: String,
  },
  comment: { 
    type: String,
  },
}, {
  timestamps: true,
});

const Feedback = mongoose.model("Feedback", FeedbackSchema);



// Exports
module.exports = Feedback;