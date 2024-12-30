const admin_nav_btns = document.getElementById('admin_nav_btns');
const sec_orders = document.getElementById('sec_orders');
const sec_questions = document.getElementById('sec_questions');
const sec_feedback = document.getElementById('sec_feedback');
const sec_reviews = document.getElementById('sec_reviews');

Array.from(admin_nav_btns.children).forEach((elm) => {
  const btn = elm.firstElementChild;
  btn.addEventListener('click', () => {
    Array.from(admin_nav_btns.children).forEach((button) => button.firstElementChild.classList.remove("selected"));
    btn.classList.add("selected");
    sec_orders.classList.remove("open");
    sec_questions.classList.remove("open");
    sec_feedback.classList.remove("open");
    sec_reviews.classList.remove("open");
    document.getElementById(btn.getAttribute("data-section")).classList.add("open");
  });
});



// Order Panel
class OrderPanel {

  // Constructor
  constructor(title, section, data, default_prices) {
    this.default_prices = default_prices;
    this.data = data.reverse();
    this.elm_section = section;
    this.elm_section.innerHTML = `
      <div class="panel_container_orders panel_container_grid">
        <div class="content_container_wrapper">
          <h2>${ title }</h2>
          <div class="content_container"></div>
        </div>
        <div class="stats_container_wrapper">
          <div class="stats_container"></div> 
        </div>
      </div>
    `;
    this.elm_content_container = this.elm_section.querySelector(".content_container");
    this.elm_stats_container = this.elm_section.querySelector(".stats_container");
    if (this.data.length <= 0) {
      this.elm_section.innerHTML = `
        <div class="empty_container_wrapper">
          <h2>${ title }</h2>
          <div class="empty_container">
            <img src="/image/icon/empty-icon.png" alt="Nothing found icon">
            <p>Nothing to see here.</p>
          </div>
        </div>
      `;
      return;
    }
    this.createOverview();
    this.items_per_page = 12;
    this.total_pages = Math.ceil(this.data.length / this.items_per_page);
    this.timeout_page_change = true;
    this.current_page = 1;
    this.loadOrders(this.current_page);
  }

  // Creates the section containing the order data
  createOverview() {
    let total_expenses = Math.round((this.data.reduce((prevOrder, currOrder) => prevOrder + currOrder.expenses, 0) + Number.EPSILON) * 100) / 100;
    let total_revenue = Math.round((this.data.reduce((prevOrder, currOrder) => prevOrder + currOrder.revenue, 0) + Number.EPSILON) * 100) / 100;
    let total_profit = Math.round(((total_revenue - total_expenses) + Number.EPSILON) * 100) / 100;
    this.elm_stats_container.innerHTML += `
      <p class="headline">Overview</p>
      <div class="numbers_container">
        <p>Total Orders: <span>${ this.data.length }</span></p>
        <p>Total Revenue: <span>${ total_revenue } NOK</span></p>
        <p>Total Expenses: <span>-${ total_expenses } NOK</span></p>
        <p>Total Profit: <span>${ total_profit } NOK</span></p>
      </div>
      <div class="options_container"></div>
    `;
    let options_container = this.elm_stats_container.querySelector(".options_container");
    var total_units_sold = 0;
    var total_units_arr = [];
    this.default_prices.forEach((opt) => {
      let result = this.data.reduce((prevOrder, currOrder) => {
        return prevOrder + currOrder.line_items.reduce((prevItem, currItem) => {
          return prevItem + ((currItem.name === opt.name) ? currItem.quantity : 0);
        }, 0);
      }, 0);
      total_units_sold += result;
      total_units_arr.push({ opt: opt, val: result });
    });
    this.default_prices.forEach((opt) => {
      let units = total_units_arr.find(x => x.opt == opt).val;
      let percentage = Math.round(((units / total_units_sold) * 100) + Number.EPSILON);
      options_container.innerHTML += `
        <div>
          <img src="${opt.img}" alt="${opt.alt}">
          <p>${units} <span>(${percentage}%)</span></p>
        </div>
      `;
    });
  }

  // Formats the price as a user-friendly string
  formatPrice(currency, price) {
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

  // Populates the orders section with the orders
  loadOrders(page) {
    this.elm_content_container.innerHTML = "";
    var end = this.items_per_page * page;
    var start = end - this.items_per_page;
    if (end > this.data.length) end = this.data.length;
    for (let x = start; x < end; x++) {
      let order = this.data[x];
      // Calculate images
      let images = [{ img: "", alt: "" }, { img: "", alt: "" }, { img: "", alt: "" }];
      let index = 0;
      for (let item of order.line_items) {
        for (var i = 0; i < item.quantity; i++) {
          images[index] = { img: item.img, alt: item.alt };
          index++;
          if (index >= 3) break;
        }
        if (index >= 3) break;
      }
      // Create new article
      let newItem = document.createElement('article');
      newItem.innerHTML += `
        <div class="preview_container">
          <div class="flex_item_1">
            <div class="img_container" data-quantity="${(order.total_quantity <= 3) ? order.total_quantity : 3}">
              <img src="${images[0].img}" alt="${images[0].alt}">
              <img src="${images[1].img}" alt="${images[1].alt}">
              <img src="${images[2].img}" alt="${images[2].alt}">
            </div>
            <p class="total_quantity">x<span class="span_total_quantity">${order.total_quantity}</span></p>
          </div>
          <div class="flex_item_2">
            <p>Buyer: ${order.email}</p>
            <p>Total: ${this.formatPrice(order.currency, order.amount_total / 100)}</p>
          </div>
          <div class="flex_item_3">
            <button type="button"><div></div><div></div></button>
          </div>
        </div>
        <div class="expanded_container">
          <div class="separator"></div>
          <div class="line_items_container">
            <p class="line_items_headline">Line Items:</p>
          </div>
          <div class="separator"></div>
          <div class="address_container">
            <p class="customer_headline">Customer:</p>
            <p>Name: <span>${order.shipping_info.name}</span></p>
            <p>Email: <span>${order.email}</span></p>
            <p>Country: <span>${order.shipping_info.address.country || "-"}</span></p>
            <p>City: <span>${order.shipping_info.address.city || "-"}</span></p>
            <p>Address 1: <span>${order.shipping_info.address.line1 || "-"}</span></p>
            <p>Address 2: <span>${order.shipping_info.address.line2 || "-"}</span></p>
            <p>Postal code: <span>${order.shipping_info.address.postal_code || "-"}</span></p>
            <p>State: <span>${order.shipping_info.address.state || "-"}</span></p>
          </div>
          <div class="separator"></div>
          <div class="order_options_container">
            <div>
              <p>Shipping Status:</p>
              <select class="semi-rounded-corners select_status" data-custom-select data-select-shipping="true">
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="received">Received</option>
              </select>
            </div>
            <div>
              <p>Shipping time:</p>
              <div class="inp_group inp_group_st"><input class="inp_st" type="number" value="${order.shipping_time}"></div>
            </div>
            <div>
              <p>Expenses:</p>
              <div class="inp_group inp_group_expenses"><input class="inp_expenses" type="number" value="${order.expenses}"></div>  
            </div>
            <div>
              <p>Revenue:</p>
              <div class="inp_group inp_group_revenue"><input class="inp_revenue" type="number" value="${order.revenue}"></div>  
            </div>
          </div>
        </div>
      `;
      // add line items to article
      for (let item of order.line_items) {
        newItem.querySelector(".line_items_container").innerHTML += `
          <div class="line_item">
            <img src="${item.img}" alt="${item.alt}">
            <div>
              <p>${item.name} x${item.quantity}</p>
              <p>${this.formatPrice(item.currency, item.amount_total / 100)}</p>
            </div>
          </div>
        `;
      }
      // Configure preview section
      if (order.shipping_status === "processing") newItem.classList.add("new");
      if (order.shipping_status === "shipped") newItem.classList.add("shipped");
      newItem.querySelector(".preview_container").addEventListener('click', (e) => {
        e.currentTarget.parentNode.classList.toggle("open");
      });
      // Add custom select functionality
      let elm_select_status = newItem.querySelector(".select_status");
      elm_select_status.selectedIndex = (order.shipping_status === "processing") ? 0 : (order.shipping_status === "shipped") ? 1 : 2;
      elm_select_status.addEventListener('change', async () => {
        const result = await fetch('/admin/change-status', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ value: elm_select_status.value, orderID: order._id })
        }).then(res => res.json())
        if (result.error === "unauthenticated") return window.location = "/admin/login";
        if (result.error) return alert(result.error);
        if (elm_select_status.value === "processing") {
          newItem.classList.add("new");
          newItem.classList.remove("shipped");
        }
        else if (elm_select_status.value === "shipped") {
          newItem.classList.remove("new");
          newItem.classList.add("shipped");
        }
        else {
          newItem.classList.remove("new");
          newItem.classList.remove("shipped");
        }
      });
      new Select(elm_select_status);
      // Add input functionality
      let elm_inp_st = newItem.querySelector(".inp_st");
      elm_inp_st.addEventListener('change', async () => {
        const result = await fetch('/admin/change-shipping-time', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ value: elm_inp_st.value, orderID: order._id })
        }).then(res => res.json())
        if (result.error === "unauthenticated") return window.location = "/admin/login";
        if (result.error) return alert(result.error);
      });
      let elm_inp_expenses = newItem.querySelector(".inp_expenses");
      elm_inp_expenses.addEventListener('change', async () => {
        const result = await fetch('/admin/change-expenses', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ value: elm_inp_expenses.value, orderID: order._id })
        }).then(res => res.json())
        if (result.error === "unauthenticated") return window.location = "/admin/login";
        if (result.error) return alert(result.error);
      });
      let elm_inp_revenue = newItem.querySelector(".inp_revenue");
      elm_inp_revenue.addEventListener('change', async () => {
        const result = await fetch('/admin/change-revenue', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ value: elm_inp_revenue.value, orderID: order._id })
        }).then(res => res.json())
        if (result.error === "unauthenticated") return window.location = "/admin/login";
        if (result.error) return alert(result.error);
      });
      // Add item
      this.elm_content_container.appendChild(newItem);
    }
    const page_selector = document.createElement("div");
    page_selector.classList.add("page_selector");
    var prev_disabled = this.current_page > 1 ? "" : "disabled";
    var next_disabled = this.current_page < this.total_pages ? "" : "disabled";
    page_selector.innerHTML = `
      <button class="page_selector_btn_prev ${prev_disabled}">Prev</button>
      <div class="page_selector_display">
        <p class="page">Page ${this.current_page} of ${this.total_pages}</p>
        <p class="items">Showing: ${start+1} - ${end}</p>
      </div>
      <button class="page_selector_btn_next ${next_disabled}">Next</button>
    `;
    this.elm_btn_prev = page_selector.querySelector('.page_selector_btn_prev');
    this.elm_btn_next = page_selector.querySelector('.page_selector_btn_next');
    // Btn prev
    if (!this.elm_btn_prev.classList.contains("disabled")) {
      this.elm_btn_prev.addEventListener('click', () => {
        if (this.timeout_page_change) return;
        if (this.current_page - 1 < 1) return;
        this.timeout_page_change = true;
        this.current_page -= 1;
        this.loadOrders(this.current_page);
      });
    }  
    // Btn next
    if (!this.elm_btn_next.classList.contains("disabled")) {
      this.elm_btn_next.addEventListener('click', () => {
        if (this.timeout_page_change) return;
        if (this.current_page + 1 > this.total_pages) return;
        this.timeout_page_change = true;
        this.current_page += 1;
        this.loadOrders(this.current_page);
      });
    }
    this.elm_content_container.appendChild(page_selector);
    this.timeout_page_change = false;
  }
}



// Feedback Panel
class FeedbackPanel {

  // Constructor
  constructor(title, section, data) {
    this.data = data.reverse();
    this.elm_section = section;
    this.elm_section.innerHTML = `
      <div class="panel_container_feedback panel_container_grid">
        <div class="content_container_wrapper">
          <h2>${ title }</h2>
          <div class="content_container"></div>
        </div>
        <div class="stats_container_wrapper">
          <div class="stats_container"></div> 
        </div>
      </div>
    `;
    this.elm_content_container = this.elm_section.querySelector(".content_container");
    this.elm_stats_container = this.elm_section.querySelector(".stats_container");
    if (this.data.length <= 0) {
      this.elm_section.innerHTML = `
        <div class="empty_container_wrapper">
          <h2>${ title }</h2>
          <div class="empty_container">
            <img src="/image/icon/empty-icon.png" alt="Nothing found icon">
            <p>Nothing to see here.</p>
          </div>
        </div>
      `;
      return;
    }
    this.createOverview();
    this.items_per_page = 12;
    this.total_pages = Math.ceil(this.data.length / this.items_per_page);
    this.timeout_page_change = true;
    this.current_page = 1;
    this.loadFeedback(this.current_page);
  }

  // Creates the section containing the feedback data
  createOverview() {
    let q1_average = 0, q2_average = 0, q3_average = 0, q4_average = 0;
    let where_total = 0;
    let where_insta_total = 0, where_tiktok_total = 0, where_google_total = 0, where_rec_total = 0, where_other_total = 0;
    let q1_num = 0, q2_num = 0, q3_num = 0, q4_num = 0;
    this.data.forEach((feedback) => {
      if (feedback.q1 != null) { q1_average += feedback.q1; q1_num++; }
      if (feedback.q2 != null) { q2_average += feedback.q2; q2_num++; }
      if (feedback.q3 != null) { q3_average += feedback.q3; q3_num++; }
      if (feedback.q4 != null) { q4_average += feedback.q4; q4_num++; } 
      if (feedback.where === "instagram") { where_insta_total++; }
      else if (feedback.where === "tiktok") { where_tiktok_total++; }
      else if (feedback.where === "google") { where_google_total++; }
      else if (feedback.where === "recommended") { where_rec_total++; }
      else if (feedback.where === "other") { where_other_total++; }
      if (feedback.where != "") { where_total++; } 
    });
    if (q1_average != 0) q1_average = Math.round((q1_average / q1_num) + Number.EPSILON);
    if (q2_average != 0) q2_average = Math.round((q2_average / q2_num) + Number.EPSILON);
    if (q3_average != 0) q3_average = Math.round((q3_average / q3_num) + Number.EPSILON);
    if (q4_average != 0) q4_average = Math.round((q4_average / q4_num) + Number.EPSILON);
    if (q1_average == 0) q1_average = null;
    if (q2_average == 0) q2_average = null;
    if (q3_average == 0) q3_average = null;
    if (q4_average == 0) q4_average = null;
    this.elm_stats_container.innerHTML = `
      <p class="headline">Overview</p>
      <p class="total_submissions">Total Submissions: <span>${this.data.length}</span></p>
      <div class="question_container">
        <p>Question 1 Average:</p>
        <div class="stars_container" data-rating="${q1_average}">
          <svg class="star_svg star_1" x="0px" y="0px" width="228.6px" height="218px" viewBox="64 -59 228.6 218"><polygon class="star_svg_left" points="146.7,17.6 64,23.9 127.1,77.7 107.5,158.3 178.2,114.9 178.3,-59"></polygon><polygon class="star_svg_right" points="292.6,24.1 209.9,17.7 178.3,-59 178.2,114.9 248.8,158.4 229.4,77.8"></polygon></svg>
          <svg class="star_svg star_2" x="0px" y="0px" width="228.6px" height="218px" viewBox="64 -59 228.6 218"><polygon class="star_svg_left" points="146.7,17.6 64,23.9 127.1,77.7 107.5,158.3 178.2,114.9 178.3,-59"></polygon><polygon class="star_svg_right" points="292.6,24.1 209.9,17.7 178.3,-59 178.2,114.9 248.8,158.4 229.4,77.8"></polygon></svg>
          <svg class="star_svg star_3" x="0px" y="0px" width="228.6px" height="218px" viewBox="64 -59 228.6 218"><polygon class="star_svg_left" points="146.7,17.6 64,23.9 127.1,77.7 107.5,158.3 178.2,114.9 178.3,-59"></polygon><polygon class="star_svg_right" points="292.6,24.1 209.9,17.7 178.3,-59 178.2,114.9 248.8,158.4 229.4,77.8"></polygon></svg>
          <svg class="star_svg star_4" x="0px" y="0px" width="228.6px" height="218px" viewBox="64 -59 228.6 218"><polygon class="star_svg_left" points="146.7,17.6 64,23.9 127.1,77.7 107.5,158.3 178.2,114.9 178.3,-59"></polygon><polygon class="star_svg_right" points="292.6,24.1 209.9,17.7 178.3,-59 178.2,114.9 248.8,158.4 229.4,77.8"></polygon></svg>
          <svg class="star_svg star_5" x="0px" y="0px" width="228.6px" height="218px" viewBox="64 -59 228.6 218"><polygon class="star_svg_left" points="146.7,17.6 64,23.9 127.1,77.7 107.5,158.3 178.2,114.9 178.3,-59"></polygon><polygon class="star_svg_right" points="292.6,24.1 209.9,17.7 178.3,-59 178.2,114.9 248.8,158.4 229.4,77.8"></polygon></svg>
        </div> 
      </div>
      <div class="question_container">
        <p>Question 2 Average:</p>
        <div class="stars_container" data-rating="${q2_average}">
          <svg class="star_svg star_1" x="0px" y="0px" width="228.6px" height="218px" viewBox="64 -59 228.6 218"><polygon class="star_svg_left" points="146.7,17.6 64,23.9 127.1,77.7 107.5,158.3 178.2,114.9 178.3,-59"></polygon><polygon class="star_svg_right" points="292.6,24.1 209.9,17.7 178.3,-59 178.2,114.9 248.8,158.4 229.4,77.8"></polygon></svg>
          <svg class="star_svg star_2" x="0px" y="0px" width="228.6px" height="218px" viewBox="64 -59 228.6 218"><polygon class="star_svg_left" points="146.7,17.6 64,23.9 127.1,77.7 107.5,158.3 178.2,114.9 178.3,-59"></polygon><polygon class="star_svg_right" points="292.6,24.1 209.9,17.7 178.3,-59 178.2,114.9 248.8,158.4 229.4,77.8"></polygon></svg>
          <svg class="star_svg star_3" x="0px" y="0px" width="228.6px" height="218px" viewBox="64 -59 228.6 218"><polygon class="star_svg_left" points="146.7,17.6 64,23.9 127.1,77.7 107.5,158.3 178.2,114.9 178.3,-59"></polygon><polygon class="star_svg_right" points="292.6,24.1 209.9,17.7 178.3,-59 178.2,114.9 248.8,158.4 229.4,77.8"></polygon></svg>
          <svg class="star_svg star_4" x="0px" y="0px" width="228.6px" height="218px" viewBox="64 -59 228.6 218"><polygon class="star_svg_left" points="146.7,17.6 64,23.9 127.1,77.7 107.5,158.3 178.2,114.9 178.3,-59"></polygon><polygon class="star_svg_right" points="292.6,24.1 209.9,17.7 178.3,-59 178.2,114.9 248.8,158.4 229.4,77.8"></polygon></svg>
          <svg class="star_svg star_5" x="0px" y="0px" width="228.6px" height="218px" viewBox="64 -59 228.6 218"><polygon class="star_svg_left" points="146.7,17.6 64,23.9 127.1,77.7 107.5,158.3 178.2,114.9 178.3,-59"></polygon><polygon class="star_svg_right" points="292.6,24.1 209.9,17.7 178.3,-59 178.2,114.9 248.8,158.4 229.4,77.8"></polygon></svg>
        </div> 
      </div>
      <div class="question_container">
        <p>Question 3 Average:</p>
        <div class="stars_container" data-rating="${q3_average}">
          <svg class="star_svg star_1" x="0px" y="0px" width="228.6px" height="218px" viewBox="64 -59 228.6 218"><polygon class="star_svg_left" points="146.7,17.6 64,23.9 127.1,77.7 107.5,158.3 178.2,114.9 178.3,-59"></polygon><polygon class="star_svg_right" points="292.6,24.1 209.9,17.7 178.3,-59 178.2,114.9 248.8,158.4 229.4,77.8"></polygon></svg>
          <svg class="star_svg star_2" x="0px" y="0px" width="228.6px" height="218px" viewBox="64 -59 228.6 218"><polygon class="star_svg_left" points="146.7,17.6 64,23.9 127.1,77.7 107.5,158.3 178.2,114.9 178.3,-59"></polygon><polygon class="star_svg_right" points="292.6,24.1 209.9,17.7 178.3,-59 178.2,114.9 248.8,158.4 229.4,77.8"></polygon></svg>
          <svg class="star_svg star_3" x="0px" y="0px" width="228.6px" height="218px" viewBox="64 -59 228.6 218"><polygon class="star_svg_left" points="146.7,17.6 64,23.9 127.1,77.7 107.5,158.3 178.2,114.9 178.3,-59"></polygon><polygon class="star_svg_right" points="292.6,24.1 209.9,17.7 178.3,-59 178.2,114.9 248.8,158.4 229.4,77.8"></polygon></svg>
          <svg class="star_svg star_4" x="0px" y="0px" width="228.6px" height="218px" viewBox="64 -59 228.6 218"><polygon class="star_svg_left" points="146.7,17.6 64,23.9 127.1,77.7 107.5,158.3 178.2,114.9 178.3,-59"></polygon><polygon class="star_svg_right" points="292.6,24.1 209.9,17.7 178.3,-59 178.2,114.9 248.8,158.4 229.4,77.8"></polygon></svg>
          <svg class="star_svg star_5" x="0px" y="0px" width="228.6px" height="218px" viewBox="64 -59 228.6 218"><polygon class="star_svg_left" points="146.7,17.6 64,23.9 127.1,77.7 107.5,158.3 178.2,114.9 178.3,-59"></polygon><polygon class="star_svg_right" points="292.6,24.1 209.9,17.7 178.3,-59 178.2,114.9 248.8,158.4 229.4,77.8"></polygon></svg>
        </div> 
      </div>
      <div class="question_container">
        <p>Question 4 Average:</p>
        <div class="stars_container" data-rating="${q4_average}">
          <svg class="star_svg star_1" x="0px" y="0px" width="228.6px" height="218px" viewBox="64 -59 228.6 218"><polygon class="star_svg_left" points="146.7,17.6 64,23.9 127.1,77.7 107.5,158.3 178.2,114.9 178.3,-59"></polygon><polygon class="star_svg_right" points="292.6,24.1 209.9,17.7 178.3,-59 178.2,114.9 248.8,158.4 229.4,77.8"></polygon></svg>
          <svg class="star_svg star_2" x="0px" y="0px" width="228.6px" height="218px" viewBox="64 -59 228.6 218"><polygon class="star_svg_left" points="146.7,17.6 64,23.9 127.1,77.7 107.5,158.3 178.2,114.9 178.3,-59"></polygon><polygon class="star_svg_right" points="292.6,24.1 209.9,17.7 178.3,-59 178.2,114.9 248.8,158.4 229.4,77.8"></polygon></svg>
          <svg class="star_svg star_3" x="0px" y="0px" width="228.6px" height="218px" viewBox="64 -59 228.6 218"><polygon class="star_svg_left" points="146.7,17.6 64,23.9 127.1,77.7 107.5,158.3 178.2,114.9 178.3,-59"></polygon><polygon class="star_svg_right" points="292.6,24.1 209.9,17.7 178.3,-59 178.2,114.9 248.8,158.4 229.4,77.8"></polygon></svg>
          <svg class="star_svg star_4" x="0px" y="0px" width="228.6px" height="218px" viewBox="64 -59 228.6 218"><polygon class="star_svg_left" points="146.7,17.6 64,23.9 127.1,77.7 107.5,158.3 178.2,114.9 178.3,-59"></polygon><polygon class="star_svg_right" points="292.6,24.1 209.9,17.7 178.3,-59 178.2,114.9 248.8,158.4 229.4,77.8"></polygon></svg>
          <svg class="star_svg star_5" x="0px" y="0px" width="228.6px" height="218px" viewBox="64 -59 228.6 218"><polygon class="star_svg_left" points="146.7,17.6 64,23.9 127.1,77.7 107.5,158.3 178.2,114.9 178.3,-59"></polygon><polygon class="star_svg_right" points="292.6,24.1 209.9,17.7 178.3,-59 178.2,114.9 248.8,158.4 229.4,77.8"></polygon></svg>
        </div> 
      </div>
      <div class="where_container">
        <div><span>Instagram</span><span>${ where_insta_total }</span><span>(${ Math.round(((where_insta_total / where_total) * 100) + Number.EPSILON) }%)</span></div>
        <div><span>Tiktok</span><span>${ where_tiktok_total }</span><span>(${ Math.round(((where_tiktok_total / where_total) * 100) + Number.EPSILON) }%)</span></div>
        <div><span>Google Search</span><span>${ where_google_total }</span><span>(${ Math.round(((where_google_total / where_total) * 100) + Number.EPSILON) }%)</span></div>
        <div><span>Recommended</span><span>${ where_rec_total }</span><span>(${ Math.round(((where_rec_total / where_total) * 100) + Number.EPSILON) }%)</span></div>
        <div><span>Other</span><span>${ where_other_total }</span><span>(${ Math.round(((where_other_total / where_total) * 100) + Number.EPSILON) }%)</span></div>
      </div>
    `;
  }

  // Populates the feedback section with the feedback data
  loadFeedback(page) {
    this.elm_content_container.innerHTML = "";
    var end = this.items_per_page * page;
    var start = end - this.items_per_page;
    if (end > this.data.length) end = this.data.length;
    for (var i = start; i < end; i++) {
      let feedback = this.data[i];
      let newItem = document.createElement('article');
      newItem.innerHTML += `
        <div class="question_container">
          <p>Using our website</p>
          <div class="stars_container" data-rating="${feedback.q1}">
            <svg class="star_svg star_1" x="0px" y="0px" width="228.6px" height="218px" viewBox="64 -59 228.6 218"><polygon class="star_svg_left" points="146.7,17.6 64,23.9 127.1,77.7 107.5,158.3 178.2,114.9 178.3,-59"></polygon><polygon class="star_svg_right" points="292.6,24.1 209.9,17.7 178.3,-59 178.2,114.9 248.8,158.4 229.4,77.8"></polygon></svg>
            <svg class="star_svg star_2" x="0px" y="0px" width="228.6px" height="218px" viewBox="64 -59 228.6 218"><polygon class="star_svg_left" points="146.7,17.6 64,23.9 127.1,77.7 107.5,158.3 178.2,114.9 178.3,-59"></polygon><polygon class="star_svg_right" points="292.6,24.1 209.9,17.7 178.3,-59 178.2,114.9 248.8,158.4 229.4,77.8"></polygon></svg>
            <svg class="star_svg star_3" x="0px" y="0px" width="228.6px" height="218px" viewBox="64 -59 228.6 218"><polygon class="star_svg_left" points="146.7,17.6 64,23.9 127.1,77.7 107.5,158.3 178.2,114.9 178.3,-59"></polygon><polygon class="star_svg_right" points="292.6,24.1 209.9,17.7 178.3,-59 178.2,114.9 248.8,158.4 229.4,77.8"></polygon></svg>
            <svg class="star_svg star_4" x="0px" y="0px" width="228.6px" height="218px" viewBox="64 -59 228.6 218"><polygon class="star_svg_left" points="146.7,17.6 64,23.9 127.1,77.7 107.5,158.3 178.2,114.9 178.3,-59"></polygon><polygon class="star_svg_right" points="292.6,24.1 209.9,17.7 178.3,-59 178.2,114.9 248.8,158.4 229.4,77.8"></polygon></svg>
            <svg class="star_svg star_5" x="0px" y="0px" width="228.6px" height="218px" viewBox="64 -59 228.6 218"><polygon class="star_svg_left" points="146.7,17.6 64,23.9 127.1,77.7 107.5,158.3 178.2,114.9 178.3,-59"></polygon><polygon class="star_svg_right" points="292.6,24.1 209.9,17.7 178.3,-59 178.2,114.9 248.8,158.4 229.4,77.8"></polygon></svg>
          </div> 
        </div>
        <div class="question_container">
          <p>Learning about the product</p>
          <div class="stars_container" data-rating="${feedback.q2}">
            <svg class="star_svg star_1" x="0px" y="0px" width="228.6px" height="218px" viewBox="64 -59 228.6 218"><polygon class="star_svg_left" points="146.7,17.6 64,23.9 127.1,77.7 107.5,158.3 178.2,114.9 178.3,-59"></polygon><polygon class="star_svg_right" points="292.6,24.1 209.9,17.7 178.3,-59 178.2,114.9 248.8,158.4 229.4,77.8"></polygon></svg>
            <svg class="star_svg star_2" x="0px" y="0px" width="228.6px" height="218px" viewBox="64 -59 228.6 218"><polygon class="star_svg_left" points="146.7,17.6 64,23.9 127.1,77.7 107.5,158.3 178.2,114.9 178.3,-59"></polygon><polygon class="star_svg_right" points="292.6,24.1 209.9,17.7 178.3,-59 178.2,114.9 248.8,158.4 229.4,77.8"></polygon></svg>
            <svg class="star_svg star_3" x="0px" y="0px" width="228.6px" height="218px" viewBox="64 -59 228.6 218"><polygon class="star_svg_left" points="146.7,17.6 64,23.9 127.1,77.7 107.5,158.3 178.2,114.9 178.3,-59"></polygon><polygon class="star_svg_right" points="292.6,24.1 209.9,17.7 178.3,-59 178.2,114.9 248.8,158.4 229.4,77.8"></polygon></svg>
            <svg class="star_svg star_4" x="0px" y="0px" width="228.6px" height="218px" viewBox="64 -59 228.6 218"><polygon class="star_svg_left" points="146.7,17.6 64,23.9 127.1,77.7 107.5,158.3 178.2,114.9 178.3,-59"></polygon><polygon class="star_svg_right" points="292.6,24.1 209.9,17.7 178.3,-59 178.2,114.9 248.8,158.4 229.4,77.8"></polygon></svg>
            <svg class="star_svg star_5" x="0px" y="0px" width="228.6px" height="218px" viewBox="64 -59 228.6 218"><polygon class="star_svg_left" points="146.7,17.6 64,23.9 127.1,77.7 107.5,158.3 178.2,114.9 178.3,-59"></polygon><polygon class="star_svg_right" points="292.6,24.1 209.9,17.7 178.3,-59 178.2,114.9 248.8,158.4 229.4,77.8"></polygon></svg>
          </div> 
        </div>
        <div class="question_container">
          <p>Placing an order</p>
          <div class="stars_container" data-rating="${feedback.q3}">
            <svg class="star_svg star_1" x="0px" y="0px" width="228.6px" height="218px" viewBox="64 -59 228.6 218"><polygon class="star_svg_left" points="146.7,17.6 64,23.9 127.1,77.7 107.5,158.3 178.2,114.9 178.3,-59"></polygon><polygon class="star_svg_right" points="292.6,24.1 209.9,17.7 178.3,-59 178.2,114.9 248.8,158.4 229.4,77.8"></polygon></svg>
            <svg class="star_svg star_2" x="0px" y="0px" width="228.6px" height="218px" viewBox="64 -59 228.6 218"><polygon class="star_svg_left" points="146.7,17.6 64,23.9 127.1,77.7 107.5,158.3 178.2,114.9 178.3,-59"></polygon><polygon class="star_svg_right" points="292.6,24.1 209.9,17.7 178.3,-59 178.2,114.9 248.8,158.4 229.4,77.8"></polygon></svg>
            <svg class="star_svg star_3" x="0px" y="0px" width="228.6px" height="218px" viewBox="64 -59 228.6 218"><polygon class="star_svg_left" points="146.7,17.6 64,23.9 127.1,77.7 107.5,158.3 178.2,114.9 178.3,-59"></polygon><polygon class="star_svg_right" points="292.6,24.1 209.9,17.7 178.3,-59 178.2,114.9 248.8,158.4 229.4,77.8"></polygon></svg>
            <svg class="star_svg star_4" x="0px" y="0px" width="228.6px" height="218px" viewBox="64 -59 228.6 218"><polygon class="star_svg_left" points="146.7,17.6 64,23.9 127.1,77.7 107.5,158.3 178.2,114.9 178.3,-59"></polygon><polygon class="star_svg_right" points="292.6,24.1 209.9,17.7 178.3,-59 178.2,114.9 248.8,158.4 229.4,77.8"></polygon></svg>
            <svg class="star_svg star_5" x="0px" y="0px" width="228.6px" height="218px" viewBox="64 -59 228.6 218"><polygon class="star_svg_left" points="146.7,17.6 64,23.9 127.1,77.7 107.5,158.3 178.2,114.9 178.3,-59"></polygon><polygon class="star_svg_right" points="292.6,24.1 209.9,17.7 178.3,-59 178.2,114.9 248.8,158.4 229.4,77.8"></polygon></svg>
          </div> 
        </div>
        <div class="question_container">
          <p>Interacting with our team</p>
          <div class="stars_container" data-rating="${feedback.q4}">
            <svg class="star_svg star_1" x="0px" y="0px" width="228.6px" height="218px" viewBox="64 -59 228.6 218"><polygon class="star_svg_left" points="146.7,17.6 64,23.9 127.1,77.7 107.5,158.3 178.2,114.9 178.3,-59"></polygon><polygon class="star_svg_right" points="292.6,24.1 209.9,17.7 178.3,-59 178.2,114.9 248.8,158.4 229.4,77.8"></polygon></svg>
            <svg class="star_svg star_2" x="0px" y="0px" width="228.6px" height="218px" viewBox="64 -59 228.6 218"><polygon class="star_svg_left" points="146.7,17.6 64,23.9 127.1,77.7 107.5,158.3 178.2,114.9 178.3,-59"></polygon><polygon class="star_svg_right" points="292.6,24.1 209.9,17.7 178.3,-59 178.2,114.9 248.8,158.4 229.4,77.8"></polygon></svg>
            <svg class="star_svg star_3" x="0px" y="0px" width="228.6px" height="218px" viewBox="64 -59 228.6 218"><polygon class="star_svg_left" points="146.7,17.6 64,23.9 127.1,77.7 107.5,158.3 178.2,114.9 178.3,-59"></polygon><polygon class="star_svg_right" points="292.6,24.1 209.9,17.7 178.3,-59 178.2,114.9 248.8,158.4 229.4,77.8"></polygon></svg>
            <svg class="star_svg star_4" x="0px" y="0px" width="228.6px" height="218px" viewBox="64 -59 228.6 218"><polygon class="star_svg_left" points="146.7,17.6 64,23.9 127.1,77.7 107.5,158.3 178.2,114.9 178.3,-59"></polygon><polygon class="star_svg_right" points="292.6,24.1 209.9,17.7 178.3,-59 178.2,114.9 248.8,158.4 229.4,77.8"></polygon></svg>
            <svg class="star_svg star_5" x="0px" y="0px" width="228.6px" height="218px" viewBox="64 -59 228.6 218"><polygon class="star_svg_left" points="146.7,17.6 64,23.9 127.1,77.7 107.5,158.3 178.2,114.9 178.3,-59"></polygon><polygon class="star_svg_right" points="292.6,24.1 209.9,17.7 178.3,-59 178.2,114.9 248.8,158.4 229.4,77.8"></polygon></svg>
          </div> 
        </div>
        <div class="question_container">
          <p>Where did you find us?</p>
          <span data-where="${DOMPurify.sanitize(feedback.where, {USE_PROFILES: {html: false, svg: false, MathML: false}})}">${DOMPurify.sanitize(feedback.where, {USE_PROFILES: {html: false, svg: false, MathML: false}})}</span>
        </div>
        <p class="comment_headline">Comment:</p>
        <pre>${DOMPurify.sanitize(feedback.comment, {USE_PROFILES: {html: false, svg: false, MathML: false}})}</pre>
      `;
      this.elm_content_container.appendChild(newItem);
    }
    const page_selector = document.createElement("div");
    page_selector.classList.add("page_selector");
    var prev_disabled = this.current_page > 1 ? "" : "disabled";
    var next_disabled = this.current_page < this.total_pages ? "" : "disabled";
    page_selector.innerHTML = `
      <button class="page_selector_btn_prev ${prev_disabled}">Prev</button>
      <div class="page_selector_display">
        <p class="page">Page ${this.current_page} of ${this.total_pages}</p>
        <p class="items">Showing: ${start+1} - ${end}</p>
      </div>
      <button class="page_selector_btn_next ${next_disabled}">Next</button>
    `;
    this.elm_btn_prev = page_selector.querySelector('.page_selector_btn_prev');
    this.elm_btn_next = page_selector.querySelector('.page_selector_btn_next');
    // Btn prev
    if (!this.elm_btn_prev.classList.contains("disabled")) {
      this.elm_btn_prev.addEventListener('click', () => {
        if (this.timeout_page_change) return;
        if (this.current_page - 1 < 1) return;
        this.timeout_page_change = true;
        this.current_page -= 1;
        this.loadFeedback(this.current_page);
      });
    }  
    // Btn next
    if (!this.elm_btn_next.classList.contains("disabled")) {
      this.elm_btn_next.addEventListener('click', () => {
        if (this.timeout_page_change) return;
        if (this.current_page + 1 > this.total_pages) return;
        this.timeout_page_change = true;
        this.current_page += 1;
        this.loadFeedback(this.current_page);
      });
    }
    this.elm_content_container.appendChild(page_selector);
    this.timeout_page_change = false;
  }
}



// Question Panel
class QuestionPanel {

  // Constructor
  constructor(title, section, data) {
    this.data = data.reverse();
    this.elm_section = section;
    this.elm_section.innerHTML = `
      <div class="panel_container_questions">
        <h2>${ title }</h2>
        <div class="content_container"></div>
      </div>
    `;
    this.elm_content_container = this.elm_section.querySelector(".content_container");
    if (this.data.length <= 0) {
      this.elm_content_container.innerHTML = `
        <div class="empty_container">
          <img src="/image/icon/empty-icon.png" alt="Nothing found icon">
          <p>Nothing to see here.</p>
        </div>
      `;
      return;
    }
    this.items_per_page = 12;
    this.total_pages = Math.ceil(this.data.length / this.items_per_page);
    this.timeout_page_change = true;
    this.current_page = 1;
    this.loadQuestions(this.current_page);
  }

  // Populates the questions section with the question data
  loadQuestions(page) {
    this.elm_content_container.innerHTML = "";
    var end = this.items_per_page * page;
    var start = end - this.items_per_page;
    if (end > this.data.length) end = this.data.length;
    for (var i = start; i < end; i++) {
      let question = this.data[i];
      let newItem = document.createElement('article');
      newItem.innerHTML += `
        <p>Name: <span>${ DOMPurify.sanitize(question.name, {USE_PROFILES: {html: false, svg: false, MathML: false}}) }</span></p>
        <p>Email: <span>${ DOMPurify.sanitize(question.email, {USE_PROFILES: {html: false, svg: false, MathML: false}}) }</span></p>
        <p>Joined Mailing List: <span>${ question.joined_ml }</span></p>
        <div class="separator"></div>
        <pre>${ DOMPurify.sanitize(question.question, {USE_PROFILES: {html: false, svg: false, MathML: false}}) }</pre>
      `; 
      this.elm_content_container.appendChild(newItem);
    }
    const page_selector = document.createElement("div");
    page_selector.classList.add("page_selector");
    var prev_disabled = this.current_page > 1 ? "" : "disabled";
    var next_disabled = this.current_page < this.total_pages ? "" : "disabled";
    page_selector.innerHTML = `
      <button class="page_selector_btn_prev ${prev_disabled}">Prev</button>
      <div class="page_selector_display">
        <p class="page">Page ${this.current_page} of ${this.total_pages}</p>
        <p class="items">Showing: ${start+1} - ${end}</p>
      </div>
      <button class="page_selector_btn_next ${next_disabled}">Next</button>
    `;
    this.elm_btn_prev = page_selector.querySelector('.page_selector_btn_prev');
    this.elm_btn_next = page_selector.querySelector('.page_selector_btn_next');
    // Btn prev
    if (!this.elm_btn_prev.classList.contains("disabled")) {
      this.elm_btn_prev.addEventListener('click', () => {
        if (this.timeout_page_change) return;
        if (this.current_page - 1 < 1) return;
        this.timeout_page_change = true;
        this.current_page -= 1;
        this.loadQuestions(this.current_page);
      });
    }  
    // Btn next
    if (!this.elm_btn_next.classList.contains("disabled")) {
      this.elm_btn_next.addEventListener('click', () => {
        if (this.timeout_page_change) return;
        if (this.current_page + 1 > this.total_pages) return;
        this.timeout_page_change = true;
        this.current_page += 1;
        this.loadQuestions(this.current_page);
      });
    }
    this.elm_content_container.appendChild(page_selector);
    this.timeout_page_change = false;
  }
}



// Review Panel
class ReviewPanel {

  // Constructor
  constructor(title, section, data) {
    this.data = data.reverse();
    this.elm_section = section;
    this.elm_section.innerHTML = `
      <div class="panel_container_reviews">
        <h2>${ title }</h2>
        <div class="content_container"></div>
      </div>
    `;
    this.elm_content_container = this.elm_section.querySelector(".content_container");
    if (this.data.length <= 0) {
      this.elm_content_container.innerHTML = `
        <div class="empty_container">
          <img src="/image/icon/empty-icon.png" alt="Nothing found icon">
          <p>Nothing to see here.</p>
        </div>
      `;
      return;
    }
    this.timeout_toggle_isShown = false;
    this.items_per_page = 12;
    this.total_pages = Math.ceil(this.data.length / this.items_per_page);
    this.timeout_page_change = true;
    this.current_page = 1;
    this.loadReviews(this.current_page);
  }

  // Converts an image array buffer to a base64 image string
  toBase64(arr) {
    return window.btoa(arr.reduce((data, byte) => data + String.fromCharCode(byte), ''));
  }

  // Populates the reviews section with the review data
  loadReviews(page) {
    this.elm_content_container.innerHTML = "";
    var end = this.items_per_page * page;
    var start = end - this.items_per_page;
    if (end > this.data.length) end = this.data.length;
    for (var i = start; i < end; i++) {
      let review = this.data[i];
      let newArticle = document.createElement('article');
      if (review.hasImg) {
        let newImg = document.createElement('img');
        newImg.setAttribute("src", `data:${ review.img.contentType };base64,${ this.toBase64(review.img.data.data) }`);
        newImg.setAttribute("alt", "Customer submitted image");
        newArticle.appendChild(newImg);
      }
      let newButton = document.createElement('button');
      newButton.classList.add((review.isShown ? "switch_on" : "switch_off"));
      newButton.classList.add("toggle_switch");
      newButton.setAttribute("type", "button");
      newButton.setAttribute("data-review-id", review._id);
      newButton.setAttribute("data-is-shown", review.isShown);
      newButton.addEventListener("click", e => this.toggleDisplayReview(e));
      newButton.innerHTML = `
        <div class="switch"></div>
        <span class="option on_option">on</span>
        <span class="option off_option">off</span>
      `;
      newArticle.innerHTML += `
        <div class="review_header">
          <p class="review_name">${ DOMPurify.sanitize(review.name, {USE_PROFILES: {html: false, svg: false, MathML: false}}) }</p>
          <div class="stars_container review_rating" data-rating="${ DOMPurify.sanitize(review.rating, {USE_PROFILES: {html: false, svg: false, MathML: false}}) }">
            <svg class="star_svg star_1" x="0px" y="0px" width="228.6px" height="218px" viewBox="64 -59 228.6 218"><polygon class="star_svg_left" points="146.7,17.6 64,23.9 127.1,77.7 107.5,158.3 178.2,114.9 178.3,-59"></polygon><polygon class="star_svg_right" points="292.6,24.1 209.9,17.7 178.3,-59 178.2,114.9 248.8,158.4 229.4,77.8"></polygon></svg>
            <svg class="star_svg star_2" x="0px" y="0px" width="228.6px" height="218px" viewBox="64 -59 228.6 218"><polygon class="star_svg_left" points="146.7,17.6 64,23.9 127.1,77.7 107.5,158.3 178.2,114.9 178.3,-59"></polygon><polygon class="star_svg_right" points="292.6,24.1 209.9,17.7 178.3,-59 178.2,114.9 248.8,158.4 229.4,77.8"></polygon></svg>
            <svg class="star_svg star_3" x="0px" y="0px" width="228.6px" height="218px" viewBox="64 -59 228.6 218"><polygon class="star_svg_left" points="146.7,17.6 64,23.9 127.1,77.7 107.5,158.3 178.2,114.9 178.3,-59"></polygon><polygon class="star_svg_right" points="292.6,24.1 209.9,17.7 178.3,-59 178.2,114.9 248.8,158.4 229.4,77.8"></polygon></svg>
            <svg class="star_svg star_4" x="0px" y="0px" width="228.6px" height="218px" viewBox="64 -59 228.6 218"><polygon class="star_svg_left" points="146.7,17.6 64,23.9 127.1,77.7 107.5,158.3 178.2,114.9 178.3,-59"></polygon><polygon class="star_svg_right" points="292.6,24.1 209.9,17.7 178.3,-59 178.2,114.9 248.8,158.4 229.4,77.8"></polygon></svg>
            <svg class="star_svg star_5" x="0px" y="0px" width="228.6px" height="218px" viewBox="64 -59 228.6 218"><polygon class="star_svg_left" points="146.7,17.6 64,23.9 127.1,77.7 107.5,158.3 178.2,114.9 178.3,-59"></polygon><polygon class="star_svg_right" points="292.6,24.1 209.9,17.7 178.3,-59 178.2,114.9 248.8,158.4 229.4,77.8"></polygon></svg>
          </div>
        </div>
        <p class="review_comment">${ DOMPurify.sanitize(review.review, {USE_PROFILES: {html: false, svg: false, MathML: false}}) }</p>
        <div class="separator"></div>
        <div class="review_switch_container">
          <p>Display review:</p>
        </div>
      `;
      newArticle.querySelector(".review_switch_container").appendChild(newButton);
      this.elm_content_container.appendChild(newArticle);
    }
    const page_selector = document.createElement("div");
    page_selector.classList.add("page_selector");
    var prev_disabled = this.current_page > 1 ? "" : "disabled";
    var next_disabled = this.current_page < this.total_pages ? "" : "disabled";
    page_selector.innerHTML = `
      <button class="page_selector_btn_prev ${prev_disabled}">Prev</button>
      <div class="page_selector_display">
        <p class="page">Page ${this.current_page} of ${this.total_pages}</p>
        <p class="items">Showing: ${start+1} - ${end}</p>
      </div>
      <button class="page_selector_btn_next ${next_disabled}">Next</button>
    `;
    this.elm_btn_prev = page_selector.querySelector('.page_selector_btn_prev');
    this.elm_btn_next = page_selector.querySelector('.page_selector_btn_next');
    // Btn prev
    if (!this.elm_btn_prev.classList.contains("disabled")) {
      this.elm_btn_prev.addEventListener('click', () => {
        if (this.timeout_page_change) return;
        if (this.current_page - 1 < 1) return;
        this.timeout_page_change = true;
        this.current_page -= 1;
        this.loadReviews(this.current_page);
      });
    }  
    // Btn next
    if (!this.elm_btn_next.classList.contains("disabled")) {
      this.elm_btn_next.addEventListener('click', () => {
        if (this.timeout_page_change) return;
        if (this.current_page + 1 > this.total_pages) return;
        this.timeout_page_change = true;
        this.current_page += 1;
        this.loadReviews(this.current_page);
      });
    }
    this.elm_content_container.appendChild(page_selector);
    this.timeout_page_change = false;
  }

  // Sends a request to the server to toggle the display of a review
  async toggleDisplayReview(e) {
    let elm = e.currentTarget;
    if (this.timeout_toggle_isShown) return;
    this.timeout_toggle_isShown = true;
    let id = elm.getAttribute("data-review-id");
    let isShown = elm.getAttribute("data-is-shown");
    const result = await fetch('/admin/toggle-display-review', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ reviewID: id, isShown: isShown })
    }).then(res => res.json())
    this.timeout_toggle_isShown = false;
    if (result.error) return alert(result.error);
    if (isShown === "true") {
      elm.classList.add("switch_off");
      elm.classList.remove("switch_on");
      elm.setAttribute("data-is-shown", false);
    }
    else {
      elm.classList.add("switch_on");
      elm.classList.remove("switch_off");
      elm.setAttribute("data-is-shown", true);
    }
  }

}



// Create the Panels once the admin data is loaded
var myOrderPanel, myQuestionPanel, myFeedbackPanel, myReviewPanel;
async function getAdminData() {
  const result = await fetch("/admin/get-admin-data").then(res => res.json())
  if (result.error) alert(result.error);  
  myOrderPanel = new OrderPanel("Orders", sec_orders, result.order_data, result.default_prices);
  myFeedbackPanel = new FeedbackPanel("Feedback", sec_feedback, result.feedback_data);
  myQuestionPanel = new QuestionPanel("Question", sec_questions, result.question_data);
  myReviewPanel = new ReviewPanel("Reviews", sec_reviews, result.review_data);
}
getAdminData();

