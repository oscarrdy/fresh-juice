// Product swiper
const swiper_product = new Swiper(".swiper_product", {
  slidesPerView: 3,
  spaceBetween: 16,
  centeredSlides: true,
  slideToClickedSlide: true,
  loop: true,
  speed: 300,
  shortswipes: false,
  threshold: 4,
  pagination: {
    el: ".swiper_product_pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".swiper_product_button_next",
    prevEl: ".swiper_product_button_prev",
  },
  breakpoints: {
    650: {
      slidesPerView: 4,
      spaceBetween: 16,
      centeredSlides: false,
      slideToClickedSlide: false,
    },
    800: {
      slidesPerView: 5,
      spaceBetween: 8,
      centeredSlides: false,
      slideToClickedSlide: true,
    }
  },
  grabCursor: true,
});

const elmDisplayImage = document.getElementById('main_display_image');
swiper_product.on('slideChange', function () {
  if (!window.matchMedia("(min-width: 800px)").matches) return;
  const activeImageSrc = swiper_product.slides[swiper_product.activeIndex].getAttribute("src");
  elmDisplayImage.setAttribute("src", activeImageSrc);
});



// Stickybar Checkout
const btn_checkout = document.getElementById('btn_checkout');
const stickybar = document.getElementById('stickybar');
const sec_reviews = document.getElementById('sec_reviews');

const options_stickybar = {
  root: null,         
  threshold: 0,       
  rootMargin: "0% 0% -5% 0%",
};

const observer_stickybar = new IntersectionObserver((entries, observer_stickybar) => {
  entries.forEach(entry => { 
    if (entry.isIntersecting) { 
      stickybar.classList.remove("shown-bottom");
      stickybar.classList.remove("shown-top");
    }
    if (!entry.isIntersecting) {
      if (entry.boundingClientRect.top < 0) {
        stickybar.classList.add("shown-top");
      } else {
        stickybar.classList.add("shown-bottom");
      }
    }
  });
}, options_stickybar);

observer_stickybar.observe(btn_checkout);

const options_2_stickybar = {
  root: null,         
  threshold: 0,       
  rootMargin: "0% 0% -95% 0%",
};

const observer_2_stickybar = new IntersectionObserver((entries, observer_2_stickybar) => {
  entries.forEach(entry => { 
    if (entry.isIntersecting) { 
      stickybar.classList.add("shown-top");
      stickybar.classList.remove("shown-bottom");
    }
  });
}, options_2_stickybar);

observer_2_stickybar.observe(sec_reviews);



// Scroll Buttons
const btn_see_reviews = document.getElementById('btn_see_reviews');
const cart_items_container = document.getElementById('cart_items_container');
const stickybar_btn_edit_cart = document.getElementById('stickybar_btn_edit_cart');
const btn_cta_1 = document.getElementById('btn_cta_1');

btn_see_reviews.addEventListener('click', () => {
  sec_reviews.scrollIntoView({
    behavior: 'auto', 
    block: 'start',
    inline: 'center' 
  });
});
  
stickybar_btn_edit_cart.addEventListener('click', () => {
  cart_items_container.scrollIntoView({
    behavior: 'auto', 
    block: 'center',
    inline: 'center' 
  });
});

btn_cta_1.addEventListener('click', () => {
  cart_items_container.scrollIntoView({
    behavior: 'auto', 
    block: 'center',
    inline: 'center' 
  });
});



// Countdown Timer
const countdown_container_1 = document.getElementById('countdown_container_1');
const first_visit = new Date(countdown_container_1.getAttribute('data-firstVisit')).getTime();
const offer_duration = (9 * 60 * 60 * 1000) - ((1000 * 60 * 12 )+ 21000);
var countDownDate = new Date(first_visit + offer_duration).getTime();

function updateTimer() {
  // Calculate time left
  var now = new Date().getTime();
  var distance = countDownDate - now;
  if (distance < 0) return true;
  // Time calculations for days, hours, minutes and seconds
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);
  // Display the result in the element with id="demo"
  countdown_container_1.children[0].firstElementChild.innerText = ('0' + days).slice(-2);
  countdown_container_1.children[1].firstElementChild.innerText = ('0' + hours).slice(-2);
  countdown_container_1.children[2].firstElementChild.innerText = ('0' + minutes).slice(-2);
  countdown_container_1.children[3].firstElementChild.innerText = ('0' + seconds).slice(-2);
  return false;
}
updateTimer();

var countdown_timer_interval = setInterval(function() {
  var expired = updateTimer();
  if (expired) {
    var c = new Date().getTime();
    var b = new Date(first_visit + offer_duration).getTime();
    var dist = c - b;
    countDownDate = new Date(first_visit + (Math.ceil((dist / offer_duration) + 1) * offer_duration));
  }
}, 1000);



// Slide in sections
const options_sec_fade_in = {
  root: null,
  threshold: 0.5,
  rootMargin: "0px",
}

const observer_sec_fade_in = new IntersectionObserver((entries, observer_sec_fade_in) => {
  entries.forEach(entry => { 
    if (entry.isIntersecting) { 
      entry.target.classList.add("shown");
    }
    if (!entry.isIntersecting) {
      entry.target.classList.remove("shown");
    }
  });
}, options_sec_fade_in);

const sec_fade_in = document.querySelectorAll(".sec_fade_in");

sec_fade_in.forEach(section => {
  observer_sec_fade_in.observe(section);
});



// Checkout form
const zero_decimal_currencies = [
  'BIF', 'CLP', 'DJF', 'GNF', 'JPY', 'KMF', 'KRW', 'MGA', 'PYG', 'RWF', 'VND', 'VUV', 'XAF', 'XOF', 'XPF'
];
const round_up_currencies = [
  'HUF', 'TWD', 'UGX'
];

function formatPrice(currency, price) {
  let formattedPrice;
  let decimals = 2;
  if (zero_decimal_currencies.includes(currency.toUpperCase()) ||
      round_up_currencies.includes(currency.toUpperCase())) {
    decimals = 0;
  }
  try {
    formattedPrice = new Intl.NumberFormat(navigator.language, {
      style: 'currency',
      currency: currency.toUpperCase(),
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(price);
  } 
  catch (err) {
    formattedPrice = `${currency.toUpperCase()} ${price}`;
  }
  return formattedPrice;
}



class Shop {

  // Constructor
  constructor(price_data) {
    this.price_data = price_data;
    this.elm_display_price = document.getElementById("display_price");
    this.elm_display_price.innerHTML = formatPrice(this.price_data.currency, this.price_data.prices[0].price);
    this.elm_display_price_old = document.getElementById("display_price_old");
    this.elm_display_price_old.innerHTML = formatPrice(this.price_data.currency, this.price_data.prices[0].original_price);
    this.elm_price_total = document.getElementById("price_total");
    this.elm_quantity_discount = document.getElementById("quantity_discount");
    this.elm_stickybar_img_container = document.getElementById("stickybar_img_container");
    this.elm_stickybar_span_quantity = document.getElementById("stickybar_span_quantity");
    this.elm_cart_container = document.getElementById("cart_items_container");
    this.cart = [];
    this.option_elements = document.querySelectorAll(".color_option");
    this.addItem(this.option_elements[0]);
    this.option_elements[0].firstElementChild.checked = true;
  }

  // Add an item to the cart
  addItem(item) {
    
    // Check if it already exists
    const option = item.firstElementChild.getAttribute('data-option');
    if (this.cart.some(x => x.option === option)) {
      return;
    }
    
    // Add to the cart array
    const cart_item = {
      option: option,
      quantity: 1,
      price: this.price_data.prices.find(x => x.name === option).price,
      img: item.lastElementChild.getAttribute("src"),
      alt: item.lastElementChild.getAttribute("alt"), 
    };
    this.cart.push(cart_item);

    // Add to the cart element
    const newItem = document.createElement('div');
    newItem.classList.add("cart_item");
    newItem.setAttribute("data-option", cart_item.option);
    newItem.innerHTML = `
      <button class="btn_decrement" type="button"></button>
      <div class="cart_item_img_container" data-quantity="${(cart_item.quantity > 3) ? 3 : (cart_item.quantity == 0) ? 1 : cart_item.quantity}">
        <img src="${cart_item.img}" alt="${cart_item.alt}">
        <img src="${cart_item.img}" alt="${cart_item.alt}">
        <img src="${cart_item.img}" alt="${cart_item.alt}">
      </div>
      <p class="cart_item_quantity_wrapper">x<span class="cart_item_quantity">${cart_item.quantity}</span></p>
      <button class="btn_increment" type="button"></button>
      <p class="cart_item_price">${formatPrice(this.price_data.currency, cart_item.price * cart_item.quantity)}</p>
    `;
    newItem.querySelector('.btn_decrement').addEventListener("click", () => {
      this.decrementQuantity(cart_item, newItem);
    });
    newItem.querySelector('.btn_increment').addEventListener("click", () => {
      this.incrementQuantity(cart_item, newItem);
    });
    this.elm_cart_container.appendChild(newItem);
    
    // Update the total
    this.updateTotal();
    this.updateStickybar();
  }

  // Increment the quantity of an item
  incrementQuantity(cart_item, cart_elm) {
    cart_item.quantity++;
    cart_elm.querySelector(".cart_item_quantity").innerText = cart_item.quantity;
    cart_elm.querySelector(".cart_item_price").innerHTML = formatPrice(this.price_data.currency, cart_item.price * cart_item.quantity);
    cart_elm.querySelector(".cart_item_img_container").setAttribute("data-quantity", (cart_item.quantity > 3) ? 3 : (cart_item.quantity == 0) ? 1 : cart_item.quantity);
    this.updateTotal();
    this.updateStickybar();
  }

  // Decrement the quantity of an item
  decrementQuantity(cart_item, cart_elm) {
    if (cart_item.quantity <= 1) return this.removeItem(cart_item.option, cart_item, cart_elm, null);
    cart_item.quantity--;
    cart_elm.querySelector(".cart_item_quantity").innerText = cart_item.quantity;
    cart_elm.querySelector(".cart_item_price").innerHTML = formatPrice(this.price_data.currency, cart_item.price * cart_item.quantity);
    cart_elm.querySelector(".cart_item_img_container").setAttribute("data-quantity", (cart_item.quantity > 3) ? 3 : (cart_item.quantity == 0) ? 1 : cart_item.quantity);
    this.updateTotal();
    this.updateStickybar();
  }

  // Remove an item from the cart
  removeItem(option, _cart_item = null, _cart_elm = null, _option_elm = null) {
    if (this.cart.length <= 1) return;
    const cart_item = (_cart_item != null) ? _cart_item : this.cart.find(x => x.option === option);
    const cart_elm = (_cart_elm != null) ? _cart_elm : Array.from(this.elm_cart_container.children).find(x => x.getAttribute("data-option") === option); 
    const option_elm = (_option_elm != null) ? _option_elm : Array.from(this.option_elements).find(x => x.firstElementChild.getAttribute("data-option") === option).firstElementChild;
    this.cart.splice(this.cart.indexOf(cart_item), 1);
    this.elm_cart_container.removeChild(cart_elm);
    option_elm.checked = false;
    this.updateTotal();
    this.updateStickybar();
  }

  // Update the total price
  updateTotal() {
    const total_price = this.cart.reduce((prevVal, currVal) => {
      return prevVal + parseFloat(currVal.price * currVal.quantity);
    }, 0);
    const total_quantity = this.cart.reduce((prevVal, currVal) => {
      return prevVal + currVal.quantity;
    }, 0);
    let discount;
    if (total_quantity <= 1) {
      discount = 1;
      this.elm_quantity_discount.innerHTML = `Quantity Discount: <span>-0%</span>`;
    }
    else if (total_quantity === 2 || total_quantity === 3) {
      discount = 0.95;
      this.elm_quantity_discount.innerHTML = `Quantity Discount: <span>-5%</span>`;
    }
    else if (total_quantity >= 4) {
      discount = 0.90;
      this.elm_quantity_discount.innerHTML = `Quantity Discount: <span>-10%</span>`;
    }
    this.elm_price_total.innerHTML = formatPrice(this.price_data.currency, total_price * discount);
  }

  // Update the price data after a currency change
  updatePriceData(price_data) {
    this.price_data = price_data;
    this.elm_display_price.innerHTML = formatPrice(this.price_data.currency, this.price_data.prices[0].price);
    this.elm_display_price_old.innerHTML = formatPrice(this.price_data.currency, this.price_data.prices[0].original_price);
    this.cart.forEach(item => {
      item.price = this.price_data.prices.find(x => x.name === item.option).price;
      let cart_elm = Array.from(this.elm_cart_container.children).find(x => x.getAttribute("data-option") === item.option);
      cart_elm.querySelector(".cart_item_price").innerHTML = formatPrice(this.price_data.currency, item.price * item.quantity);
    });
    this.updateTotal();
  }

  // Start the loading animation when the price is being updated
  startLoadingAnimation() {
    if (this.elm_display_price_old.innerHTML != "") {
      this.elm_display_price_old.innerHTML = "";
      this.elm_display_price.innerHTML = `<span class="loading_dots"><span></span><span></span><span></span></span>`;
      this.elm_price_total.innerHTML = `<span class="loading_dots"><span></span><span></span><span></span></span>`;
      Array.from(this.elm_cart_container.children).forEach(elm => {
        elm.querySelector(".cart_item_price").innerHTML = `<span class="loading_dots"><span></span><span></span><span></span></span>`;
      });
    }
  }

  // Update the stickybar
  updateStickybar() {
    var index = 0;
    for (let item of this.cart) {
      for (var i = 0; i < item.quantity; i++) {
        this.elm_stickybar_img_container.children[index].setAttribute("src", item.img);
        this.elm_stickybar_img_container.children[index].setAttribute("alt", item.alt);
        index++;
        if (index >= 3) break;
      }
      if (index >= 3) break;
    }
    this.elm_stickybar_img_container.setAttribute("data-quantity", (index > 3) ? 3 : (index == 0) ? 1 : index);
    const total_quantity = this.cart.reduce((prevVal, currVal) => prevVal + currVal.quantity, 0);
    this.elm_stickybar_span_quantity.innerText = total_quantity;
  }

}



let myShop;
async function createShop() {
  const { price_data } = await fetch('/shop/get-price-data').then(res => res.json())
  myShop = new Shop(price_data);
}
createShop();



const color_options_container = document.getElementById('color_options_container');
color_options_container.addEventListener('click', (e) => {
  if (e.target.tagName != "INPUT") return;
  if (e.target.checked) {
    if (window.matchMedia("(min-width: 650px) and (max-width: 799.9px)").matches) {
      swiper_product.slideToLoop(parseInt(e.target.getAttribute("data-slide") - 1), 300, true);
    } else {
      swiper_product.slideToLoop(parseInt(e.target.getAttribute("data-slide")), 300, true);
    }
    myShop.addItem(e.target.parentNode);
  } else {
    if (myShop.cart.length <= 1) {
      e.target.checked = true;
    } else {
      myShop.removeItem(e.target.getAttribute("data-option"), null, null, e.target);
    }
  }
});



// Listen for a currency change
document.addEventListener('currency-changed', async () => {
  const { price_data } = await fetch('/shop/get-price-data').then(res => res.json())
  myShop.updatePriceData(price_data);
});



// Create a checkout session
const form_checkout = document.getElementById('form_checkout');
const stickybar_btn_checkout = document.getElementById('stickybar_btn_checkout');
var checkout_timeout = false;

form_checkout.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (checkout_timeout) return;
  checkout_timeout = true;
  btn_checkout.innerHTML = `<span class="loading_dots"><span></span><span></span><span></span></span>`;
  stickybar_btn_checkout.innerHTML = `<span class="loading_dots"><span></span><span></span><span></span></span>`;

  await fetch('/shop/create-checkout-session', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ 
      cart: myShop.cart,
      url: window.location.href,
    })
  })
  .then(async res => {
    if (res.ok) {
      return await res.json();
    }
    else {
      return res.json().then(json => Promise.reject(json))
    }
  })
  .then(({ url }) => {
    btn_checkout.innerHTML = "Checkout";
    stickybar_btn_checkout.innerHTML = "Checkout";
    stickybar_btn_checkout.blur();
    checkout_timeout = false;
    window.location = url
  })
  .catch(err => {
    btn_checkout.innerHTML = "Checkout";
    stickybar_btn_checkout.innerHTML = "Checkout";
    stickybar_btn_checkout.blur();
    checkout_timeout = false;
    console.error(err);
    alert("Oops! Something went wrong ...\nPlease try again.");
  })
});