// Imports
const fetch = require('node-fetch');
const request_ip = require("request-ip");
const jwt = require("jsonwebtoken");
const country_to_currency = require('country-to-currency');
const User = require("../models/user-schema");
const { 
  default_currency, 
  allowed_currencies, 
  default_user,
  default_locale, 
  logError,
} = require("./common-data");



// Function to get the user IP address when Heroku is used due to them using proxies
function get_client_ip(req) {
  return req.headers['x-forwarded-for']?.split(",")?.[0]?.trim();
}



// Function to get the user geo-data
async function get_geodata(req) {
  try {

    // Get the IP address of the client
    const IP = get_client_ip(req) || request_ip.getClientIp(req); 
    if (process.env.ENVIRONMENT === "production" && IP == null) {
      await logError(`Couldn't get clients IP address.`);
      return { 
        ip: null,
        country: null,
        currency: default_currency,
      }
    }

    // Get the geo-data of the client
    const geo_data = (process.env.ENVIRONMENT === "production")
      ? await fetch(`https://get.geojs.io/v1/ip/country/${IP}.json`).then(res => res.json())
      : await fetch("https://get.geojs.io/v1/ip/country.json").then(res => res.json())
    if (!geo_data) {
      await logError(`Failed to fetch geodata.`);
      return {
        ip: geo_data.ip,
        country: null,
        currency: default_currency,
      }
    }

    // Get the country and currency of the client
    let country = geo_data.name || geo_data.country_3 || geo_data.country;
    let currency = country_to_currency[geo_data.country]?.toUpperCase() || default_currency;
    if (!allowed_currencies.includes(currency)) {
      await logError(`Unsupported currency "${currency}".`);
      currency = default_currency;
    }
    return {
      ip: geo_data.ip,
      country: country, 
      currency: currency,
    }

  // Handle errors
  }
  catch (err) {
    await logError(`Failed to get geo-data.`, err);
    return {
      ip: null,
      country: null,
      currency: default_currency
    }
  }
}



// Function to create a new user object
async function createUser(req, res) {
  const { ip, country, currency } = await get_geodata(req);
  try {

    // Create a new user object
    const user = await User.create({
      currency: currency,
      country: country,
      locale: req.headers['accept-language']?.split(",")?.[0] || default_locale,
      ip: ip,
    });

    // Create a new JWT token
    const tokenPayload = { 
      id: user._id,
      currency: user.currency,
      email: user.email,
    }
    const tokenSettings = {
      expiresIn: "3650d",
    }
    const token = jwt.sign(tokenPayload, process.env.JWT_ACCESS_SEC, tokenSettings);

    // Set the JWT token as a cookie
    await res.cookie("UserJWT", token, {
      secure: process.env.ENVIRONMENT === "production",
      httpOnly: true,
      expires: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000), // 10 years
    });

    // Return the user object
    return user;

  // Handle errors
  }
  catch (err) {
    await logError(`Failed to create user object.`, err);
    return false;
  }
}



// Middleware to get the user object
async function getUser(req, res, next) {

  // Skip if the user object is already set
  if (req.user instanceof User) {
    return next();
  }

  // Create a new user if UserJWT is not set
  if (!req.cookies?.UserJWT) {
    const user = await createUser(req, res);
    if (!user) {
      res.clearCookie("UserJWT");
      req.user = default_user;
    }
    else {
      req.user = user;
    }
    return next();
  }

  // Verify and get the user object from the UserJWT if it is set
  else {
    jwt.verify(req.cookies.UserJWT, process.env.JWT_ACCESS_SEC, async (err, payload) => {
      if (err) {
        await logError(`Failed to verify UserJWT.`, err);
        res.clearCookie("UserJWT");
        req.user = default_user;
        return next();
      }
      else {
        const user = await User.findOne({ _id: payload.id });
        if (!(user instanceof User)) {
          res.clearCookie("UserJWT");
          req.user = default_user;
        }
        else {
          req.user = user;
        }
        return next();
      }
    });
  }
}



// Exports
module.exports = { 
  getUser,
};