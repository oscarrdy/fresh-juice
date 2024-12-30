// Util function to format the price to a user-friendly format
function formatPrice(currency, price) {
  let formattedPrice;
  try {
    formattedPrice = new Intl.NumberFormat(navigator.language, {
      style: 'currency',
      currency: currency.toUpperCase(),
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  } 
  catch (err) {
    formattedPrice = `${currency.toUpperCase()} ${price}`;
  }
  return formattedPrice;
}

// Util function to format the date to a user-friendly format
const months = ["January", "February", "March", "April", "May", "june", "july", "August", "September", "October", "November", "December"];
function formatDate(dateStr) {
  let date = new Date(dateStr);
  let day = date.getDate();
  let month = months[date.getMonth()];
  let year = date.getFullYear();
  return day + ". " + month + " " + year;
}


// Get the elements
const elm_created_at = document.getElementById('created_at');
const date_created_at = elm_created_at.getAttribute("data-date")
elm_created_at.innerText = "Ordered: " + formatDate(date_created_at);

const elm_current_location = document.getElementById('current_location');
const elm_shipping_status = document.getElementById('span_shipping_status');
const elm_delivery_date = document.getElementById('span_delivery_date');
const elm_delivery_time = document.getElementById('span_delivery_time');
const estimated_time_container = document.getElementById('estimated_time_container');
const shipping_status = estimated_time_container.getAttribute("data-shipping-status");
const shipping_time = +estimated_time_container.getAttribute("data-shipping-time");



// Gets the difference in days between two dates
function getDaysBetweenDates(date1, date2) {
  let difference = date1.getTime() - date2.getTime();
  let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
  return TotalDays;
}



// Update the delivery date and time based on the shipping status
if (shipping_status === "processing") {
  elm_delivery_date.innerText = "updating soon";
  elm_delivery_time.innerText = "updating soon";
  elm_current_location.style.left = "0%";
}
else {
  let date_delivery = new Date(date_created_at);
  date_delivery.setDate(date_delivery.getDate() + shipping_time);
  elm_delivery_date.innerText = formatDate(date_delivery);
  if (date_delivery <= new Date(Date.now())) {
    elm_delivery_time.innerText = "0 days";
    elm_current_location.style.left = "100%";
  }
  else {
    let days_elapsed = getDaysBetweenDates(new Date(Date.now()), new Date(date_created_at));
    elm_delivery_time.innerText = shipping_time - days_elapsed + " days";
    let time_elapsed = new Date(Date.now()) - new Date(date_created_at);
    let total_time = date_delivery - new Date(date_created_at);
    let percentage = Math.round(time_elapsed / total_time * 100);
    elm_current_location.style.left = `${percentage}%`;
  }
}



// Update the price data based on the user's currency
document.querySelectorAll(".item_price").forEach(elm => {
  elm.innerText = formatPrice(elm.getAttribute("data-currency"), +elm.getAttribute("data-price") / 100);
});
document.querySelectorAll(".item_unit_price").forEach(elm => {
  if (+elm.getAttribute("data-quantity") > 1) {
    elm.innerText = "(" + formatPrice(elm.getAttribute("data-currency"), +elm.getAttribute("data-price") / 100) + " each)";
  }
});

const amount_total = document.getElementById('amount_total');
amount_total.innerHTML = `Total: <span>${formatPrice(amount_total.getAttribute("data-currency"), +amount_total.getAttribute("data-price") / 100)}</span>`;



// Confirm received
const btn_confirm_received = document.getElementById('btn_confirm_received');
const order_id = btn_confirm_received.getAttribute("data-order-id");
var confirm_received_timeout = false;
if (shipping_status !== "received") {
  btn_confirm_received.addEventListener('click', openConfirmReceived);
}
else {
  btn_confirm_received.classList.add("confirmed");
  btn_confirm_received.innerHTML = `<div class="checkmark"></div><span>Received</span>`;
}

const dialog_confirm_container = document.getElementById('dialog_confirm_container');
const btn_dialog_confirm = document.getElementById('btn_dialog_confirm');
const btn_dialog_cancel = document.getElementById('btn_dialog_cancel');

dialog_confirm_container.addEventListener('click', (e) => {
  if (e.target == dialog_confirm_container) return cancelConfirmReceived();
});
btn_dialog_confirm.addEventListener('click', () => confirmReceived());
btn_dialog_cancel.addEventListener('click', () => cancelConfirmReceived());

function openConfirmReceived() {
  dialog_confirm_container.classList.add("open");
}

function cancelConfirmReceived() {
  dialog_confirm_container.classList.remove("open");
}

async function confirmReceived() {
  dialog_confirm_container.classList.remove("open");
  confirm_received_timeout = true;
  btn_confirm_received.innerHTML = `<span class="loading_dots"><span></span><span></span><span></span></span>`;
  const result = await fetch('/track-order/confirm-received', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ order_id: order_id }),
  }).then(res => res.json())
  confirm_received_timeout = false;
  if (result.error) {
    btn_confirm_received.innerHTML = `Confirm Received`;
    return alert("An unknown error occurred.\nPlease try again later.");
  }
  else {
    btn_confirm_received.removeEventListener('click', openConfirmReceived);
    elm_shipping_status.innerText = "Received";
    btn_confirm_received.classList.add("confirmed");
    btn_confirm_received.innerHTML = `<div class="checkmark"></div><span>Received</span>`;
  }
}
