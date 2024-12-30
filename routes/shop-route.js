// Imports
const router = require("express").Router();
const stripe = require("stripe")(process.env.ENVIRONMENT === "production" ? process.env.STRIPE_LIVE_SEC : process.env.STRIPE_TEST_SEC);
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const Order = require("../models/order-schema");
const User = require("../models/user-schema");
const { getUser } = require("../utils/user-data");
const { getPriceData } = require("../utils/price-data");
const { getReviewData } = require("../utils/review-data");
const { 
  default_currency, 
  default_prices,
  allowed_currencies,
  klarna_currencies,
  logError,
  website_info
} = require("../utils/common-data");



// Shop page
router.get("/", getUser, async (req, res) => {
  const review_data = await getReviewData();
  res.render("shop", {
    website_info: website_info,
    allowed_currencies: allowed_currencies,
    user: req.user,
    default_prices: default_prices,
    review_data: review_data,
  });
});



// Gets the price data based on the user's currency
router.get("/get-price-data", getUser, getPriceData, (req, res) => {
  res.json({
    price_data: req.price_data,
  });
});



// Change the user's currency
router.post("/change-currency", getUser, async (req, res) => {  
  var new_currency = req.body.new_currency.toUpperCase();
  if (!allowed_currencies.includes(new_currency)) {
    await logError(`Invalid currency: ${currency}.`);
    new_currency = default_currency;
  }
  try {
    await User.findByIdAndUpdate(req.user.id, { 
      currency: new_currency,
    });
    req.user.currency = new_currency;
  } 
  catch (err) {
    await logError(`Failed to update user currency.`, err);
  }
  res.json({ 
    success: true,
  });
});



// Success page after checkout
router.get("/success", getUser, (req, res) => {
  res.render("success", {
    website_info: website_info,
    allowed_currencies: allowed_currencies,
    user: req.user,
  });
});



// Create and open a Stripe checkout session page
router.post("/create-checkout-session", getUser, getPriceData, async (req, res) => {
  
  // Get line items object
  var line_items = [];
  var currency = req.price_data.currency;
  var order_id = crypto.randomBytes(6).toString('hex');
  try {
    var total_quantity = 0;
    for (var i = 0; i < req.body.cart.length; i++) {
      total_quantity += req.body.cart[i].quantity;
    }
    for (var i = 0; i < req.body.cart.length; i++) {
      let item_data = req.price_data.prices.find(obj => obj.name === req.body.cart[i].option);
      let unit_amount = +item_data.price_val;
      unit_amount = Math.round((total_quantity >= 4) ? unit_amount *= 0.90 : (total_quantity >= 2) ? unit_amount *= 0.95 : unit_amount);
      line_items.push({
        price_data: {
          currency: currency,
          product_data: {
            name: `${item_data.name}`,
            images: [`${process.env.SERVER_URL}${item_data.img}`],
            metadata: { img: JSON.stringify(item_data.img).replaceAll("\"", ""), alt: JSON.stringify(item_data.alt).replaceAll("\"", "") },
          },
          unit_amount: unit_amount,
        },
        quantity: req.body.cart[i].quantity,
      });
    }
  }
  catch (err) {
    await logError("Failed to construct line items.", err);
    res.status(500).json({ 
      error: "failed to construct line items",
    });
  }

  // Create the session
  try {
    const payment_methods = (klarna_currencies.includes(currency.toUpperCase())) ? ['card', 'klarna'] : ['card'];
    const session = await stripe.checkout.sessions.create({
      payment_method_types: payment_methods,
      shipping_address_collection: {
        allowed_countries: ['AC', 'AD', 'AE', 'AF', 'AG', 'AI', 'AL', 'AM', 'AO', 'AR', 'AT', 'AU', 'AW', 'AX', 'AZ', 'BA',
          'BB', 'BD', 'BE', 'BF', 'BG', 'BH', 'BI', 'BJ', 'BL', 'BM', 'BN', 'BO', 'BQ', 'BR', 'BS', 'BT', 'BV', 'BW', 'BY',
          'BZ', 'CA', 'CD', 'CF', 'CG', 'CH', 'CI', 'CK', 'CL', 'CM', 'CN', 'CO', 'CR', 'CV', 'CW', 'CY', 'CZ', 'DE', 'DJ',
          'DK', 'DM', 'DO', 'DZ', 'EC', 'EE', 'EG', 'EH', 'ER', 'ES', 'ET', 'FI', 'FJ', 'FK', 'FO', 'FR', 'GA', 'GB', 'GD',
          'GE', 'GF', 'GG', 'GH', 'GI', 'GL', 'GM', 'GN', 'GP', 'GQ', 'GR', 'GS', 'GT', 'GU', 'GW', 'GY', 'HK', 'HN', 'HR',
          'HT', 'HU', 'ID', 'IE', 'IL', 'IM', 'IN', 'IO', 'IQ', 'IS', 'IT', 'JE', 'JM', 'JO', 'JP', 'KE', 'KG', 'KH', 'KI',
          'KM', 'KN', 'KR', 'KW', 'KY', 'KZ', 'LA', 'LB', 'LC', 'LI', 'LK', 'LR', 'LS', 'LT', 'LU', 'LV', 'LY', 'MA', 'MC',
          'MD', 'ME', 'MF', 'MG', 'MK', 'ML', 'MM', 'MN', 'MO', 'MQ', 'MR', 'MS', 'MT', 'MU', 'MV', 'MW', 'MX', 'MY', 'MZ',
          'NA', 'NC', 'NE', 'NG', 'NI', 'NL', 'NO', 'NP', 'NR', 'NU', 'NZ', 'OM', 'PA', 'PE', 'PF', 'PG', 'PH', 'PK', 'PL',
          'PM', 'PN', 'PR', 'PS', 'PT', 'PY', 'QA', 'RE', 'RO', 'RS', 'RU', 'RW', 'SA', 'SB', 'SC', 'SE', 'SG', 'SH', 'SI',
          'SJ', 'SK', 'SL', 'SM', 'SN', 'SO', 'SR', 'SS', 'ST', 'SV', 'SX', 'SZ', 'TA', 'TC', 'TD', 'TF', 'TG', 'TH', 'TJ',
          'TK', 'TL', 'TM', 'TN', 'TO', 'TR', 'TT', 'TV', 'TW', 'TZ', 'UA', 'UG', 'US', 'UY', 'UZ', 'VA', 'VC', 'VE', 'VG',
          'VN', 'VU', 'WF', 'WS', 'XK', 'YE', 'YT', 'ZA', 'ZM', 'ZW'],
      },
      shipping_options: [{
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: { amount: 0, currency: currency },
          display_name: 'Free Shipping',
          delivery_estimate: {
            minimum: { unit: 'business_day', value: 4 },
            maximum: { unit: 'business_day', value: 21 },
          }
        }
      }],
      mode: "payment",
      allow_promotion_codes: true,
      metadata: {
        user_id: JSON.stringify(req.user._id).replaceAll("\"", ""),
        order_id: order_id,
      },
      line_items: line_items,
      success_url: `${process.env.SERVER_URL}/shop/success?id=${order_id}`,
      cancel_url: req.body.url,
    });
    res.json({ url: session.url });
  }
  catch (err) {
    await logError("Failed to create checkout session.", err);
    res.status(500).json({ 
      error: err.message,
    });
  }

});



// Webhook for Stripe checkout session completed
router.post("/webhook", async (req, res) => {
  
  // verify event came from stripe
  const payload = req.rawBody;
  const sig = req.headers['stripe-signature'];
  let event;
  let customer_email;
  try {
    event = stripe.webhooks.constructEvent(
      payload,
      sig,
      process.env.ENVIRONMENT === "production" ? process.env.WEBHOOK_LIVE_SEC : process.env.WEBHOOK_TEST_SEC
    );
  }
  catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // handle the checkout event
  if (event.type === 'checkout.session.completed') {
    try {
      const session = await stripe.checkout.sessions.retrieve(event.data.object.id);
      const line_items = await stripe.checkout.sessions.listLineItems(event.data.object.id, {
        expand: ['data.price.product'],
      });
      customer_email = session.customer_details.email;
      const newOrder = await Order.create({
        order_id: session.metadata.order_id,
        user_id: session.metadata.user_id,
        checkout_session_id: session.id,
        payment_status: session.payment_status,
        amount_total: session.amount_total,
        line_items: line_items.data,
        shipping_info: session.shipping || session.shipping_details,
        email: customer_email,
      });
      // TODO: Purchase emailing hosting plan to send emails
      // sendEmailConfirmation(session, customer_email, line_items.data[0].currency);
      await User.findByIdAndUpdate( session.metadata.user_id, { $push: { 
        orders: newOrder.id,
      }});
      await User.findById(session.metadata.user_id);
    }
    catch (err) {
      await logError(`Failed to save order in webhook.`, err);
      return res.status(400).send(`Webhook Order Error: ${err.message}`);
    }
  }
  res.sendStatus(200);
});



// Send email confirmation
function sendEmailConfirmation(session, customer_email, currency) {
  try {
    const transporter = nodemailer.createTransport({
      service: "hotmail",
      auth: {
        user: process.env.EMAIL_NAME,
        pass: process.env.EMAIL_PASS
      },
    });
    const options = {
      from: process.env.EMAIL_NAME,
      to: process.env.EMAIL_NAME,
      subject: `${website_info.name} - New Order From: ${customer_email}`,
      html: `
        <h1>New Order</h1>
        <p>From: ${customer_email}</p>
        <p style="text-decoration: underline;">Total: ${session.amount_total / 100} ${currency.toUpperCase()}</p>
      `,
    };
    transporter.sendMail(options, async (err, info) => {
      if (err) {
        await logError(`Failed to send email confirmation.`, err);
      }
    });
  }
  catch (err) {
    logError(`Failed to send email confirmation.`, err);
  }
}



// Exports
module.exports = router;