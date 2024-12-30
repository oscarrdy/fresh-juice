// Imports
const router = require("express").Router();
const sharp = require('sharp');
const Filter = require('bad-words-plus');
const User = require("../models/user-schema");
const Order = require("../models/order-schema");
const Review = require("../models/review-schema");
const { getUser } = require("../utils/user-data");
const { 
  uploadedImageSizeLimit,
  compressedImageSizeLimit,
  allowedImageExtensions,
  getReviewArray,
} = require("../utils/review-data");
const { 
  allowed_currencies, 
  logError, 
  website_info
} = require("../utils/common-data");



// Write review page
router.get("/", getUser, (req, res) => {
  res.render("write-review", {
    website_info: website_info,
    allowed_currencies: allowed_currencies,
    user: req.user,
  });
});



// Get the array of all reviews
router.get("/get-review-array", async (req, res) => {
  try {
    const review_array = await getReviewArray();
    res.json({ 
      review_array: review_array,
    });
  }
  catch (err) {
    await logError("Failed to get review array.", err);
    res.json({
      error: err.message,
    });
  }
});



// Submit a new review
router.post("/submit-review", getUser, async (req, res) => {
  try {
    
    // Get the body data
    const img = req.files?.img;
    const newReviewData = {
      orderId: req.body.order_id,
      name: req.body.name || "Shopper",
      rating: Math.round(req.body.rating),
      review: req.body.review,
      hasImg: !img,
    }

    // Validate OrderID
    const foundOrder = await Order.find({ order_id: newReviewData.orderId });
    if (foundOrder.length == 0) {
      return res.status(400).json({
        error: "invalid order id",
      });
    }

    // Validate that the review has not already been submitted
    const foundReview = await Review.find({ order_id: newReviewData.orderId });
    if (foundReview != 0) {
      return res.status(400).json({ 
        error: "review already submitted",
      });
    }

    // Validate the review
    if (newReviewData.review === "") {
      return res.status(400).json({
        error: "empty review",
      });
    }
    const filter = new Filter({
      firstLetter: true,
      lastLetter: true
    });
    newReviewData.review = filter.clean(newReviewData.review);
    newReviewData.name = newReviewData.name.split(" ").map(x => x.charAt(0).toUpperCase() + x.slice(1)).join(" ");
    newReviewData.name = filter.clean(newReviewData.name);

    // If the review has an image
    if (newReviewData.hasImg) {
      
      // Validate the image
      if (img.size > uploadedImageSizeLimit) {
        return res.status(400).json({
          error: "file size limit exceeded",
          uploadedImageSizeLimit: uploadedImageSizeLimit,
        });
      }
      if (!allowedImageExtensions.includes(img.mimetype.split("/")[1])) {
        return res.status(400).json({
          error: "file type not allowed",
        });
      }
      
      // Compress the image
      const compressedImg = await sharp(img.data).rotate().resize(400, 400).toFormat('webp').toBuffer();
      const { 
        format: compressedFormat,
        size: imgSizeCompressed
      } = await sharp(compressedImg).metadata();
      
      // Validate the compressed image
      if (imgSizeCompressed > compressedImageSizeLimit) {
        return res.status(400).json({
          error: "compressed size limit exceeded",
          compressedImageSizeLimit: compressedImageSizeLimit,
        });
      }

      // Add the image to the review object
      newReviewData.imgSizeOriginal = img.size;
      newReviewData.imgSizeCompressed = imgSizeCompressed;
      newReviewData.img = { 
        data: compressedImg, 
        contentType: `image/${compressedFormat.toLowerCase()}`,
      }

    }

    // Create and save the review
    const newReview = await Review.create(newReviewData);
    await User.findByIdAndUpdate(req.user.id, { $push: { reviews: newReview.id }});
    res.json({ 
      success: true
    });

  }

  // Handle errors
  catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        error: "duplicate field",
      });
    }
    await logError("Failed to submit review.", err);
    res.status(500).json({
      error: "unknown",
    });
  }

});



// Exports
module.exports = router;