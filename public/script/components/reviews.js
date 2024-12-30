// Reviews Swiper
const swiper_reviews = new Swiper(".swiper_reviews", {
  spaceBetween: 16,
  loop: true,
  speed: 300,
  shortswipes: false,
  threshold: 4,
  pagination: {
    el: ".swiper_reviews_pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".swiper_reviews_button_next",
    prevEl: ".swiper_reviews_button_prev",
  },
  breakpoints: {
    320: {
      slidesPerView: 3,
      centeredSlides: true,
      slideToClickedSlide: true,
    },
    601: {
      slidesPerView: 4,
      centeredSlides: false,
      slideToClickedSlide: false,
    },
    751: {
      slidesPerView: 2,
      centeredSlides: false,
      slideToClickedSlide: false,
    },
    950: {
      slidesPerView: 3,
      centeredSlides: false,
      slideToClickedSlide: false,
    },
    1400: {
      slidesPerView: 4,
      centeredSlides: false,
      slideToClickedSlide: false,
    },
  },
  grabCursor: true,
});



// Review Swiper Manager
class ReviewSwiper {
  
  // Constructor
  constructor(review_array) {
    
    // Ensure that the last page has at least 4 slides
    this.slides_per_page = 10;
    this.slides_per_page_min = 4;
    this.review_array = review_array;
    this.slides_on_last_page = this.review_array.length % this.slides_per_page;
    if (this.slides_on_last_page < this.slides_per_page_min) {
      for (var i = 0; i < this.slides_on_last_page; i++) {
        this.review_array.pop();
      }
    }

    // Initialize
    this.current_page = 1;
    this.total_pages = Math.ceil(this.review_array.length / this.slides_per_page);
    this.timeout_page_change = true;
    this.elm_page_selector_display = document.getElementById('page_selector_display');
    this.elm_btn_prev = document.getElementById('page_selector_btn_prev');
    this.elm_btn_next = document.getElementById('page_selector_btn_next');
    this.loadSlides(this.current_page);
    
    // Initialize prev button  
    this.elm_btn_prev.addEventListener('click', () => {
      if (this.timeout_page_change) return;
      if (this.current_page - 1 < 1) return;
      this.timeout_page_change = true;
      this.current_page -= 1;
      if (this.current_page - 1 < 1) this.elm_btn_prev.classList.add("disabled");
      this.elm_btn_next.classList.remove("disabled");
      this.loadSlides(this.current_page);
    });
    
    // Initialize next button
    this.elm_btn_next.addEventListener('click', () => {
      if (this.timeout_page_change) return;
      if (this.current_page + 1 > this.total_pages) return;
      this.timeout_page_change = true;
      this.current_page += 1;
      if (this.current_page + 1 > this.total_pages) this.elm_btn_next.classList.add("disabled");
      this.elm_btn_prev.classList.remove("disabled");
      this.loadSlides(this.current_page);
    });
  }

  // Convert array to base64
  toBase64(arr) {
    return window.btoa(arr.reduce((data, byte) => data + String.fromCharCode(byte), ''));
  }

  // Load slides for the given page
  loadSlides(page) {
    
    swiper_reviews.removeAllSlides();
    var end = this.slides_per_page * page;
    var start = end - this.slides_per_page;
    if (end > this.review_array.length) {
      end = this.review_array.length;
    }
    
    for (let i = start; i < end; i++) {
      let review = this.review_array[i];
      let newItem = document.createElement('div');
      newItem.classList.add("swiper-slide");
      newItem.innerHTML = `
        <div class="container">
          <img loading="lazy" src="" alt="Customer submitted image">
          <div class="review_header">
            <p class="review_name">${ DOMPurify.sanitize(review.name, {USE_PROFILES: {html: false, svg: false, MathML: false}}) }</p>
            <div class="stars_container rating${ review.rating } review_rating">
              <svg class="star_svg star_1" x="0px" y="0px" width="228.6px" height="218px" viewBox="64 -59 228.6 218"><polygon class="star_svg_left" points="146.7,17.6 64,23.9 127.1,77.7 107.5,158.3 178.2,114.9 178.3,-59"></polygon><polygon class="star_svg_right" points="292.6,24.1 209.9,17.7 178.3,-59 178.2,114.9 248.8,158.4 229.4,77.8"></polygon></svg>
              <svg class="star_svg star_2" x="0px" y="0px" width="228.6px" height="218px" viewBox="64 -59 228.6 218"><polygon class="star_svg_left" points="146.7,17.6 64,23.9 127.1,77.7 107.5,158.3 178.2,114.9 178.3,-59"></polygon><polygon class="star_svg_right" points="292.6,24.1 209.9,17.7 178.3,-59 178.2,114.9 248.8,158.4 229.4,77.8"></polygon></svg>
              <svg class="star_svg star_3" x="0px" y="0px" width="228.6px" height="218px" viewBox="64 -59 228.6 218"><polygon class="star_svg_left" points="146.7,17.6 64,23.9 127.1,77.7 107.5,158.3 178.2,114.9 178.3,-59"></polygon><polygon class="star_svg_right" points="292.6,24.1 209.9,17.7 178.3,-59 178.2,114.9 248.8,158.4 229.4,77.8"></polygon></svg>
              <svg class="star_svg star_4" x="0px" y="0px" width="228.6px" height="218px" viewBox="64 -59 228.6 218"><polygon class="star_svg_left" points="146.7,17.6 64,23.9 127.1,77.7 107.5,158.3 178.2,114.9 178.3,-59"></polygon><polygon class="star_svg_right" points="292.6,24.1 209.9,17.7 178.3,-59 178.2,114.9 248.8,158.4 229.4,77.8"></polygon></svg>
              <svg class="star_svg star_5" x="0px" y="0px" width="228.6px" height="218px" viewBox="64 -59 228.6 218"><polygon class="star_svg_left" points="146.7,17.6 64,23.9 127.1,77.7 107.5,158.3 178.2,114.9 178.3,-59"></polygon><polygon class="star_svg_right" points="292.6,24.1 209.9,17.7 178.3,-59 178.2,114.9 248.8,158.4 229.4,77.8"></polygon></svg>
            </div>
          </div>
          <p class="review_comment">${ DOMPurify.sanitize(review.review, {USE_PROFILES: {html: false, svg: false, MathML: false}}) }</p>
        </div>
      `;
      if (review.hasImg) {
        let img = newItem.querySelector("img");
        if (review.isUserSubmitted) {
          img.src = `data:${ review.img.contentType };base64,${ this.toBase64(review.img.data.data) }`;
        }
        else {
          img.src = review.img;
        }
      }
      swiper_reviews.appendSlide(newItem);
    }

    swiper_reviews.slideToLoop(0, 0, false);
    this.elm_page_selector_display.firstElementChild.innerText = `Page ${this.current_page} of ${this.total_pages}`;
    this.elm_page_selector_display.lastElementChild.innerText = `Showing: ${start + 1} - ${end}`;
    setTimeout(() => {
      this.timeout_page_change = false;
    }, 500);

  }

}



// Fetch the reviews and create the swiper
var myReviewSwiper;
async function createReviewSwiper() {
  const result = await fetch("/write-review/get-review-array").then(res => res.json())
  myReviewSwiper = new ReviewSwiper(result.review_array);
}
createReviewSwiper();



// Update statistics
document.querySelectorAll(".reviews_progress_fill").forEach((elm) => {
  let percentage = elm.getAttribute("data-percentage");
  elm.style.width = percentage * 100 + "%";
});