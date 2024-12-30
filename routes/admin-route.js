// Imports
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user-schema");
const Order = require("../models/order-schema");
const Review = require("../models/review-schema");
const Feedback = require("../models/feedback-schema");
const Question = require("../models/question-schema");
const { getUser } = require("../utils/user-data");
const { 
  allowed_currencies,
  default_prices,
  website_info
} = require("../utils/common-data");



// Middleware function to authenticate that the user is an admin
async function authAdmin(req, res, next) {
  if (!req.cookies?.AdminJWT) {
    return res.redirect("/admin/login");
  }
  else {
    jwt.verify(req.cookies.AdminJWT, process.env.JWT_ACCESS_SEC, async (err, payload) => {
      if (err) {
        console.log(`Failed to verify AdminJWT: ${err.message}`);
        return res.redirect("/admin/login");
      }
      else {
        const user = await User.findOne({ _id: payload.id });
        if (!user.isAdmin) {
          return res.redirect("/admin/login");
        }
        else {
          return next();
        }
      }
    });
  }
}



// Middleware function to authenticate that the user is an admin with JSON response
async function authAdminJSON(req, res, next) {
  if (!req.cookies?.AdminJWT) {
    return res.status(401).json({ error: "unauthenticated" });
  }
  else {
    jwt.verify(req.cookies.AdminJWT, process.env.JWT_ACCESS_SEC, async (err, payload) => {
      if (err) {
        console.log(`Failed to verify AdminJWT: ${err.message}`);
        return res.status(403).json({ error: "unauthenticated" });
      }
      else {
        const user = await User.findOne({ _id: payload.id });
        if (!user.isAdmin) {
          return res.status(403).json({ error: "unauthenticated" });
        }
        else {
          return next();
        }
      }
    });
  }
}



// Admin page
router.get("/", getUser, authAdmin, (req, res) => {
  res.render("admin", {
    website_info: website_info,
    allowed_currencies: allowed_currencies,
    user: req.user,
  });
});



// Admin login page 
router.get("/login", getUser, (req, res) => {
  res.render("admin-login", {
    website_info: website_info,
    allowed_currencies: allowed_currencies,
    user: req.user,
  });
});



// Login logic
router.post("/login", getUser, async (req, res) => {
  
  // Check if the password is correct
  if (req.body.pass !== process.env.ADMIN_PASS) {
    return res.status(403).json({
      error: "incorrect password",
    });
  } 

  try {
    
    // Update the user object to be an admin
    const user = await User.findByIdAndUpdate(req.user.id, {
      isAdmin: true
    });

    // Create a JWT cookie
    const tokenPayload = { id: user._id }
    const tokenSettings = { expiresIn: "3650d" }
    const token = jwt.sign(tokenPayload, process.env.JWT_ACCESS_SEC, tokenSettings);

    // Set the JWT token as a cookie
    res.cookie("AdminJWT", token, {
      secure: process.env.ENVIRONMENT === "production",
      httpOnly: true,
      expires: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000), // 10 years
    });

    // Redirect to the admin page
    return res.json({ success: true });
  }

  // Handle errors
  catch (err) {
    console.log(`Failed to create admin JWT cookie: ${err.message}`);
    return res.status(500).json({ error: "unknown error" });
  }

});



// Get the data for the admin page
router.get("/get-admin-data", authAdminJSON, async (req, res) => {
  try {
    const orders = await Order.find();
    const feedback = await Feedback.find();
    const questions = await Question.find();
    const reviews = await Review.find();
    res.json({
      order_data: orders,
      feedback_data: feedback,
      question_data: questions,
      review_data: reviews,
      default_prices: default_prices,
    });
  }
  catch (err) {
    console.log(`Failed to get admin data: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
});



// Change the status of an order
router.post("/change-status", authAdminJSON, async (req, res) => {
  try {
    await Order.findByIdAndUpdate(req.body.orderID, {
      shipping_status: req.body.value 
    });
    res.json({ success: true });
  }
  catch (err) {
    console.log(`Failed to update shipping status: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
});



// Change the shipping time of an order
router.post("/change-shipping-time", authAdminJSON, async (req, res) => {
  try {
    await Order.findByIdAndUpdate(req.body.orderID, {
      shipping_time: req.body.value
    });
    res.json({ success: true });
  }
  catch (err) {
    console.log(`Failed to update shipping time: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
});



// Change the expenses of an order
router.post("/change-expenses", authAdminJSON, async (req, res) => {
  try {
    await Order.findByIdAndUpdate(req.body.orderID, {
      expenses: req.body.value
    });
    res.json({ success: true });
  }
  catch (err) {
    console.log(`Failed to update expenses: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
});



// Change the revenue of an order
router.post("/change-revenue", authAdminJSON, async (req, res) => {
  try {
    await Order.findByIdAndUpdate(req.body.orderID, {
      revenue: req.body.value
    });
    res.json({ success: true });
  }
  catch (err) {
    console.log(`Failed to update revenue: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
});



// Change the visibility status of a user submitted review
router.post("/toggle-display-review", authAdminJSON, async (req, res) => {
  try {
    const isShown = (req.body.isShown === "true") ? false : true;
    await Review.findByIdAndUpdate(req.body.reviewID, {
      isShown: isShown
    });
    res.json({ success: true });
  }
  catch (err) {
    console.log(`Failed to update isShown: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
});



// Exports
module.exports = router;