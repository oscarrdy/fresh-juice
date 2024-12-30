// Imports
const router = require("express").Router();
const Order = require("../models/order-schema");
const { getUser } = require("../utils/user-data");
const { 
  allowed_currencies,
  logError,
  website_info
} = require("../utils/common-data");



// Track order page
router.get("/", getUser, (req, res) => {
  res.render("track-order", {
    website_info: website_info,
    allowed_currencies: allowed_currencies,
    user: req.user,
  });
});



// Track specific order page
router.get("/:id", getUser, async (req, res) => {
  const order = await Order.findOne({ 
    order_id: req.params.id,
  });
  if (!(order instanceof Order)) {
    return res.redirect("/incorrect-id");
  }
  res.render("track-order-view", {
    website_info: website_info,
    allowed_currencies: allowed_currencies,
    user: req.user,
    order: order,
  });
})



// Search for an order
router.post("/search", async (req, res) => {
  try {
    const search = req.body.search;
    var orders = await Order.find({ 
      email: search.toLowerCase(),
    });
    if (orders.length == 0) {
      orders = [ 
        await Order.findOne({ 
          order_id: search.toLowerCase() 
        }) 
      ];
    }
    if (orders.includes(null)) {
      return res.json({ 
        error: "nothing found",
      });
    }
    return res.json({ 
      orders: orders,
    });
  }
  catch (err) {
    await logError("Failed to preform search.", err.message);
    return res.status(500).json({ error: "unknown error" });
  }
});



// Confirm an order as received
router.post("/confirm-received", async (req, res) => {
  try {
    await Order.findByIdAndUpdate(req.body.order_id, { 
      shipping_status: "received",
    });
    res.json({ 
      success: true,
    });
  }
  catch (err) {
    await logError(`Failed to confirm order ${req.body.order_id} as received.`, err);
    res.json({ 
      error: err.message,
    });
  }
});



// Exports
module.exports = router;