// Imports
const router = require("express").Router();
const User = require("../models/user-schema");
const { logError } = require("../utils/common-data");
const { getUser } = require("../utils/user-data");



// Subscribe to the mailing list
router.post("/subscribe", getUser, async (req, res) => {
  try {
    await User.findByIdAndUpdate( req.user.id, { 
      email: req.body.email,
    });
    return res.json({
      success: true,
    });
  }
  catch (err) {
    await logError("Failed to join the mailing list.", err);
    return res.json({ 
      error: "unknown error",
    });
  }
});



// Unsubscribe from the mailing list
router.post("/unsubscribe", getUser, async (req, res) => {
  try {
    await User.findByIdAndUpdate( req.user.id, {
      email: "",
    });
    return res.json({
      success: true,
    });
  }
  catch (err) {
    await logError("Failed to unsubscribe from the mailing list.", err);
    return res.json({
      error: "unknown error",
    });
  }
});



// Exports
module.exports = router;