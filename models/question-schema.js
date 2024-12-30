// Imports
const mongoose = require("mongoose");



// Question Schema
const QuestionSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
  },
  email: { 
    type: String, 
    required: true,
  },
  question: { 
    type: String, 
    required: true,
  },
  joined_ml: { 
    type: Boolean, 
    required: true,
  },
}, {
  timestamps: true,
});

QuestionSchema.pre('save', function (next) {
  this.email = this.email.toLowerCase();
  next();
});

const Question = mongoose.model("Question", QuestionSchema);



// Exports
module.exports = Question;