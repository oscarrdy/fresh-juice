// Get elements
const form_search = document.getElementById('form_search');
const inp_search = document.getElementById('inp_search');
const nothing_found_container = document.getElementById('nothing_found_container');
const something_found_container = document.getElementById('something_found_container');
const loading_container = document.getElementById('loading_container');



// Util function to format price to a user-friendly format
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



// Util function to format date to a user-friendly format
const months = ["January", "February", "March", "April", "May", "june", "july", "August", "September", "October", "November", "December"];
function formatDate(dateStr) {
  let date = new Date(dateStr);
  let day = date.getDate();
  let month = months[date.getMonth()];
  let year = date.getFullYear();
  return day + ". " + month + " " + year;
}



// Search for an order
var form_search_timeout = false;
async function preformSearch(search) {
  if (form_search_timeout == true) return;
  form_search_timeout = true;
  nothing_found_container.classList.remove("shown");
  something_found_container.classList.remove("shown");
  loading_container.classList.add("shown");

  const result = await fetch('/track-order/search', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ search: search })
  }).then(res => res.json())

  setTimeout(() => {
    form_search_timeout = false;
  }, 500);

  if (result.error === "nothing found") {
    setTimeout(() => {
      nothing_found_container.classList.add("shown");
      something_found_container.classList.remove("shown");
      loading_container.classList.remove("shown");
    }, 500);
  }

  if (result.orders) {
    nothing_found_container.classList.remove("shown");
    loading_container.classList.remove("shown");
    something_found_container.classList.add("shown");
    something_found_container.innerHTML = "";
    result.orders.reverse().forEach((order) => {
      something_found_container.innerHTML += `
        <article>
          <div class="header">
            <p>Status: ${order.shipping_status[0].toUpperCase() + order.shipping_status.slice(1)}</p>
            <p>Ordered: ${formatDate(order.createdAt)}</p>
          </div>
          <div class="main">
            <div class="main_left">
              <img src="${order.line_items[0].img}" alt="${order.line_items[0].alt}">
              <div>
                <p class="order_total">Total: ${formatPrice(order.line_items[0].currency, order.amount_total / 100)}</p>
              </div>
            </div>
            <div class="main_right">
              <button type="button" class="btn_confirm_received" data-order-id="${order._id}" data-order-status="${order.shipping_status}">Confirm Received</button>
              <a href="/track-order/${order.order_id}" target="_blank">Track Order</a>
            </div>
          </div>
        </article>
      `;
      order.line_items.forEach((item) => {
        const elm = document.createElement('p');
        elm.innerText = item.name + " x" + item.quantity;
        something_found_container.lastElementChild.querySelector(".order_total").parentNode.insertBefore(elm, something_found_container.lastElementChild.querySelector(".order_total"));
      }); 
    });
    something_found_container.querySelectorAll(".btn_confirm_received").forEach((btn) => {
      if (btn.getAttribute("data-order-status") !== "received") {
        btn.addEventListener('click', openConfirmReceived);
        btn.myParam = btn.getAttribute("data-order-id");
      }
      else {
        btn.classList.add("confirmed");
        btn.innerHTML = `<div class="checkmark"></div><span>Received</span>`;
      }
    });
  }

  if (result.error === "unknown error") {
    setTimeout(() => {
      nothing_found_container.classList.add("shown");
      something_found_container.classList.remove("shown");
      loading_container.classList.remove("shown");
      alert("Search failed due to an unknown error.\nPlease try again later ...")
    }, 500);
  }
}

form_search.addEventListener('submit', async (e) => {
  e.preventDefault();
  preformSearch(inp_search.value);
});

if (inp_search.value != "") {
  preformSearch(inp_search.value);
}



// Confirm received
const dialog_confirm_container = document.getElementById('dialog_confirm_container');
const btn_dialog_confirm = document.getElementById('btn_dialog_confirm');
const btn_dialog_cancel = document.getElementById('btn_dialog_cancel');

dialog_confirm_container.addEventListener('click', (e) => {
  if (e.target == dialog_confirm_container) return cancelConfirmReceived();
});
btn_dialog_confirm.addEventListener('click', () => confirmReceived(dialog_confirm_container.getAttribute("data-order-id")));
btn_dialog_cancel.addEventListener('click', () => cancelConfirmReceived());

function openConfirmReceived(evt) {
  dialog_confirm_container.classList.add("open");
  dialog_confirm_container.setAttribute("data-order-id", evt.currentTarget.myParam);
}

function cancelConfirmReceived() {
  dialog_confirm_container.classList.remove("open");
}

async function confirmReceived(id) {
  dialog_confirm_container.classList.remove("open");
  confirm_received_timeout = true;
  const btn = something_found_container.querySelector("[data-order-id='" + id + "']");
  btn.innerHTML = `<span class="loading_dots"><span></span><span></span><span></span></span>`;
  const result = await fetch('/track-order/confirm-received', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ order_id: id }),
  }).then(res => res.json())
  confirm_received_timeout = false;
  if (result.error) {
    btn.innerHTML = `Confirm Received`;
    return alert("An unknown error occurred.\nPlease try again later.");
  }
  else {
    btn.removeEventListener('click', openConfirmReceived);
    btn.parentNode.parentNode.previousElementSibling.firstElementChild.innerText = "Received";
    btn.classList.add("confirmed");
    btn.innerHTML = `<div class="checkmark"></div><span>Received</span>`;
  }
}