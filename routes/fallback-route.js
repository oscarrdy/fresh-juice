// Imports
const router = require("express").Router();
const { getUser } = require("../utils/user-data");
const { allowed_currencies, website_info } = require("../utils/common-data");



// 404 page
router.get("*", getUser, async (req, res) => {
    res.status(404).render("404", {
        website_info: website_info,
        allowed_currencies: allowed_currencies,
        user: req.user,
    });
});



// Exports
module.exports = router;