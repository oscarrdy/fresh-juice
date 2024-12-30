// Imports
const router = require("express").Router();
const { getUser } = require("../utils/user-data");
const { recipes } = require("../utils/recipe-data");
const { allowed_currencies, website_info } = require("../utils/common-data");



// Gets the array of recipes
router.get("/get-all-json", (req, res) => {
  res.json(recipes);
});



// Recipe page
router.get("/:id", getUser, (req, res) => {
  const recipeName = req.params.id.replaceAll("-", " ");
  const recipe = recipes.find((recipe) => recipe.name.toLowerCase() === recipeName.toLowerCase());
  res.render("recipe", {
    website_info: website_info,
    allowed_currencies: allowed_currencies,
    user: req.user,
    recipe: recipe,
  });
});



// Exports
module.exports = router;