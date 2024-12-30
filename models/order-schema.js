// Imports
const mongoose = require("mongoose");



// Order Schema
const OrderSchema = new mongoose.Schema({
  order_id: { 
    type: String, 
    required: true,
  },
  user_id: { 
    type: String, 
    required: true,
  },
  checkout_session_id: { 
    type: String, 
    required: true,
  },
  payment_status: { 
    type: String, 
    required: true,
  },
  amount_total: { 
    type: Number, 
    required: true,
  },
  currency: { 
    type: String,
  },
  total_quantity: { 
    type: Number,
  },
  line_items: { 
    type: [Object], 
    required: true,
  },
  shipping_info: { 
    type: Object, 
    required: true,
  },
  email: { 
    type: String,
  },
  shipping_status: {
    type: String,
    default: "processing",
  },
  shipping_time: {
    type: Number,
    default: 0,
  },
  expenses: {
    type: Number,
    default: 0,
  },
  revenue: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

OrderSchema.pre('save', function (next) {
  this.order_id = this.order_id.toLowerCase();
  this.email = this.email.toLowerCase();
  this.line_items = this.line_items.map((item) => {
    return {
      livemode: item.price.livemode,
      type: item.price.type,
      name: item.description,
      img: item.price.product.metadata.img,
      alt: item.price.product.metadata.alt,
      unit_amount: item.price.unit_amount,
      quantity: item.quantity,
      currency: item.currency,
      amount_discount: item.amount_discount,
      amount_subtotal: item.amount_subtotal,
      amount_tax: item.amount_tax,
      amount_total: item.amount_total,
    }
  });
  this.total_quantity = this.line_items.reduce((prevVal, currVal) => prevVal + currVal.quantity, 0);
  this.currency = this.line_items[0].currency;
  next();
}); 

const Order = mongoose.model("Order", OrderSchema);



// Exports
module.exports = Order;