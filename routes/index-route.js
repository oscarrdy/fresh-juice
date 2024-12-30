// Imports
const router = require("express").Router();
const { getUser } = require("../utils/user-data");
const { allowed_currencies, website_info } = require("../utils/common-data");



// Home page
router.get("/", getUser, async (req, res) => {
  res.render("home", {
    website_info: website_info,
    allowed_currencies: allowed_currencies,
    user: req.user,
  });
});



// Terms of service page
router.get("/terms-of-service", getUser, (req, res) => {
  res.render("terms-of-service", {
    website_info: website_info,
    allowed_currencies: allowed_currencies,
    user: req.user,
  });
});



// Return policy page
router.get("/return-policy", getUser, (req, res) => {
  res.render("return-policy", {
    website_info: website_info,
    allowed_currencies: allowed_currencies,
    user: req.user,
  });
});



// Privacy policy page
router.get("/privacy-policy", getUser, (req, res) => {
  res.render("privacy-policy", {
    website_info: website_info,
    allowed_currencies: allowed_currencies,
    user: req.user,
  });
});



// Exports
module.exports = router;