// Imports
const Error = require("../models/error-schema");



// Website object
const website_info = {
  name: "Fresh Juice",
  name_email: "Fresh%20Juice",
  link: "https://shop-freshjuice.com/",
  instagram_link: "https://www.instagram.com/fresh_juice___/",
  tiktok_link: "https://www.tiktok.com/@fresh_juice_blender?lang=en",
  sale: 40,
}



// default pricing data
const default_currency = 'EUR';
const default_locale = 'en-us';
const default_prices = [
  { 
    name: "Fresh Juice Portable Blender (pink)",
    price_val: 5999,
    price: 59.99,
    swiper_slide: 0,
    img: "/image/fj-pink-min.webp",
    alt: "Fresh Juice Portable Blender (pink)"
  },
  { 
    name: "Fresh Juice Portable Blender (white)",
    price_val: 5999,
    price: 59.99,
    swiper_slide: 1,
    img: "/image/fj-white-min.webp",
    alt: "Fresh Juice Portable Blender (white)"
  },
];
const sale_val = 0.4;




// Currency data
const allowed_currencies = [
  'EUR', 'USD', 'AED', 'AFN', 'ALL', 'AMD', 'ANG', 'AOA', 'ARS', 'AUD', 'AWG', 'AZN', 'BAM', 'BBD', 'BDT', 'BGN', 'BIF', 'BMD', 'BND', 'BOB', 'BRL', 'BSD', 'BWP',
  'BYN', 'BZD', 'CAD', 'CDF', 'CHF', 'CLP', 'CNY', 'COP', 'CRC', 'CVE', 'CZK', 'DJF', 'DKK', 'DOP', 'DZD', 'EGP', 'ETB', 'FJD', 'FKP', 'GBP', 'GEL', 'GIP', 'GMD',
  'GNF', 'GTQ', 'GYD', 'HKD', 'HNL', 'HRK', 'HTG', 'HUF', 'IDR', 'ILS', 'INR', 'ISK', 'JMD', 'JPY', 'KES', 'KGS', 'KHR', 'KMF', 'KRW', 'KYD', 'KZT', 'LAK', 'LBP',
  'LKR', 'LRD', 'LSL', 'MAD', 'MDL', 'MGA', 'MKD', 'MMK', 'MNT', 'MOP', 'MRO', 'MUR', 'MVR', 'MWK', 'MXN', 'MYR', 'MZN', 'NAD', 'NGN', 'NIO', 'NOK', 'NPR', 'NZD',
  'PAB', 'PEN', 'PGK', 'PHP', 'PKR', 'PLN', 'PYG', 'QAR', 'RON', 'RSD', 'RUB', 'RWF', 'SAR', 'SBD', 'SCR', 'SEK', 'SGD', 'SHP', 'SLL', 'SOS', 'SRD', 'STD', 'SZL',
  'THB', 'TJS', 'TOP', 'TRY', 'TTD', 'TWD', 'TZS', 'UAH', 'UGX', 'UYU', 'UZS', 'VND', 'VUV', 'WST', 'XAF', 'XCD', 'XOF', 'XPF', 'YER', 'ZAR', 'ZMW'
];
const zero_decimal_currencies = ['BIF', 'CLP', 'DJF', 'GNF', 'JPY', 'KMF', 'KRW', 'MGA', 'PYG', 'RWF', 'VND', 'VUV', 'XAF', 'XOF', 'XPF'];
const round_up_currencies = ['HUF', 'TWD', 'UGX'];
const klarna_currencies = ['AUD', 'CAD', 'CHF', 'EUR', 'GBP', 'DKK', 'NOK', 'NZD', 'PLN', 'SEK', 'USD'];



// Default user object
const default_user = {
  isFallback: true,
  id: null,
  email: "",
  currency: default_currency,
}



// Create error util function
async function logError(msg = null, err = null) {
  if (process.env.ENVIRONMENT === "production") {
    try {
      await Error.create({
        event: msg,
        error: err,
      });
    }
    catch (err) {
      console.error("Failed to save the error.");
      console.log(err);
    }
  }
  else {
    if (msg) console.error(msg);
    if (err) console.log(err);
  }
}



// Exports
module.exports = {
  website_info,
  default_currency,
  default_locale,
  default_prices,
  sale_val,
  allowed_currencies,
  zero_decimal_currencies,
  round_up_currencies,
  klarna_currencies,
  default_user,
  logError,
}