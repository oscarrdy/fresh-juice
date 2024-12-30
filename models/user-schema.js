// Imports
const mongoose = require("mongoose");
const { default_currency } = require("../utils/common-data");



// User Schema
const UserSchema = new mongoose.Schema({
  currency: {
    type: String,
    default: default_currency || "",
  },
  country: { 
    type: String, 
    default: "",
  },
  locale: {
    type: String,
    default: "",
  },
  ip: { 
    type: String, 
    default: "",
  },
  isAdmin: { 
    type: Boolean, 
    default: false,
  },
  orders: {
    type: Array,
    default: [],
  },
  reviews: { 
    type: Array, 
    default: [],
  },
  feedback: { 
    type: Array, 
    default: [],
  },
  questions: { 
    type: Array, 
    default: [],
  },
  email: { 
    type: String,
    default: "",
  },
}, {
  timestamps: true,
});

UserSchema.pre('save', function (next) {
  if (typeof this.email === 'string' || this.email instanceof String) {
    this.email = this.email.toLowerCase();
  }
  next();
}); 

const User = mongoose.model("User", UserSchema);



// Exports
module.exports = User;