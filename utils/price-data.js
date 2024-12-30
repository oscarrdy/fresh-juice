// Imports
const fetch = require('node-fetch');
const User = require("../models/user-schema");
const { 
  default_currency,
  default_locale,
  default_prices,
  sale_val,
  zero_decimal_currencies,
  round_up_currencies,
  logError,
} = require("./common-data");



// Used to get the price of the items before the sale is applied
function setOriginalPrice(price_data, sale) {
  price_data.prices.forEach((obj) => {
    return obj.original_price = (Math.round((Math.ceil(obj.price) / (1 - sale) + Number.EPSILON - 0.01) * 100) / 100).toFixed(2);
  });
}



// Used to round the prices to the nearest 5 and then subtract 1 cent to get .99 and .49 endings
function roundPrice(price_data) {
  price_data.prices.forEach((obj) => {
    if (obj.price < 100) {
      obj.price = (((Math.round(obj.price) * 100) - 1) / 100).toFixed(2);
      obj.price_val = obj.price * 100;
    }
    else {
      obj.price = ((((Math.round(obj.price/5)*5) * 100) - 1) / 100).toFixed(2);
      obj.price_val = obj.price * 100;
    }
  });
}



// Middleware to get the price data for the items based on the user's currency
async function getPriceData(req, res, next) {
  
  // Default price data
  const price_data = {
    sale_val: sale_val,
    currency: default_currency,
    locale: req.headers['accept-language'].split(",")[0] || default_locale,
    conversion_rate: 1,
    prices: JSON.parse(JSON.stringify(default_prices)),
  }

  // Check if req.user is set
  if (!req.user || req.user.currency === 'EUR') {
    setOriginalPrice(price_data, sale_val);
    req.price_data = price_data;
    return next();
  }

  // Convert price to new currency
  // TODO: Cache response
  // TODO: Add the APIs fallback feature
  price_data.currency = req.user.currency;
  try {
    const base_currency = 'eur';
    const conversion_obj = await fetch(`
      https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${base_currency}.json`
    ).then(res => res.json())
    const conversion_rate = conversion_obj[base_currency][price_data.currency.toLowerCase()];
    price_data.conversion_rate = conversion_rate;
    price_data.prices.forEach(item => {
      item.price_val = +Math.ceil(item.price_val * price_data.conversion_rate);
      item.price = +(item.price_val / 100).toFixed(2);
    });
    roundPrice(price_data);
  }
  catch (err) {
    await logError(`Conversion to ${price_data.currency.toLowerCase()} failed.`, err);
    price_data.currency = default_currency;
    price_data.conversion_rate = 1;
    price_data.prices = JSON.parse(JSON.stringify(default_prices));
  }

  // Handle special currency cases
  if (zero_decimal_currencies.includes(price_data.currency)) {
    price_data.prices.forEach(item => {
      item.price_val = +Math.ceil(item.price_val / 100);
      item.price = +Math.ceil(item.price);
    });
  }
  if (round_up_currencies.includes(price_data.currency)) {
    price_data.prices.forEach(item => {
      item.price_val = +Math.ceil(item.price_val / 100) * 100;
      item.price = +Math.ceil(item.price).toFixed(2);
    });
  }

  // Update currency if fallback was used
  if (req.user.currency != price_data.currency) {
    try {
      await User.findByIdAndUpdate(req.user.id, { currency: price_data.currency });
      req.user.currency = price_data.currency;
    } 
    catch (err) {
      await logError(`Failed to update user currency to default currency after fallback was used.`, err);
    }
  } 

  // Save price-data
  setOriginalPrice(price_data, sale_val);
  req.price_data = price_data;
  return next();

}



// Exports
module.exports = { getPriceData };