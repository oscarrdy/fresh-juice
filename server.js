// Import libraries
const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const PORT = process.env.PORT || 4000;
const path = require("path");

// Import routes
const indexRouter = require("./routes/index-route");
const shopRouter = require("./routes/shop-route");
const contactRouter = require("./routes/contact-route");
const trackOrderRouter = require("./routes/track-order-route");
const reviewRouter = require("./routes/review-route");
const recipeRouter = require("./routes/recipe-route");
const mailingListRouter = require("./routes/mailing-list-route");
const adminRouter = require("./routes/admin-route");
const fallbackRoute = require("./routes/fallback-route");

// Import utils
const getRawData = require("./utils/raw-data");

// connect to the MongoDB database
mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_URL)
  .catch((err) => console.error(err))

// Configuration
app.set("view engine", "ejs");
app.set('trust proxy', true); // NOTE: for heroku forwarded header to work
app.use(cookieParser());
app.use(getRawData);
app.use(express.json());
app.use('/', express.static(path.join(__dirname, '/public')));
app.use(fileUpload());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  console.log('Headers:', req.headers);
  console.log('req.ip:', req.ip);
  console.log('req.ips:', req.ips); // Array of IPs when `trust proxy` is enabled
  next();
});



// Set up routes
app.use("/", indexRouter);
app.use("/shop", shopRouter);
app.use("/contact", contactRouter);
app.use("/track-order", trackOrderRouter);
app.use("/write-review", reviewRouter);
app.use("/recipe", recipeRouter);
app.use("/mailing-list", mailingListRouter);
app.use("/admin", adminRouter);
app.get('*', fallbackRoute);

// the port to listen to
app.listen(PORT);
