// Stickybar observer
const header = document.getElementById('header');
const stickybar = document.getElementById('stickybar');

const options_stickybar = {
  root: null,         
  threshold: 0,       
  rootMargin: "0% 0% -100% 0%",
};

const observer_stickybar = new IntersectionObserver((entries, observer_stickybar) => {
  entries.forEach(entry => { 
    if (entry.isIntersecting) { 
      stickybar.classList.remove("shown");
    }
    if (!entry.isIntersecting) {
      stickybar.classList.add("shown");
    }
  });
}, options_stickybar);

observer_stickybar.observe(header);



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



// Countdown Timer
const countdown_date = document.getElementById('countdown_date');
function displayDate() {
  const x = new Date(Date.now());
  const date = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][x.getMonth()];
  const day = x.getDate();
  return `- ending ${date} ${day}.`;
}
countdown_date.innerText = displayDate();

const countdown_container_1 = document.getElementById('countdown_container_1');
const countdown_container_2 = document.getElementById('countdown_container_2');
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
  countdown_container_2.children[0].firstElementChild.innerText = ('0' + days).slice(-2);
  countdown_container_2.children[1].firstElementChild.innerText = ('0' + hours).slice(-2);
  countdown_container_2.children[2].firstElementChild.innerText = ('0' + minutes).slice(-2);
  countdown_container_2.children[3].firstElementChild.innerText = ('0' + seconds).slice(-2);
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



// Swiper Recipes
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('/recipe/get-all-json');
    const recipes = await response.json();
    const swiper_recipes_slides_container = document.getElementById('swiper_recipes_slides_container');
    for (let i = 0; i < recipes.length; i++) {
      swiper_recipes_slides_container.innerHTML += `
        <div class="swiper-slide" data-index="${i}">
          <div class="container">
            <img loading="lazy" src="${recipes[i].displayImageUrl}" alt="${recipes[i].name}">
            <p class="recipe_name">${recipes[i].name}</p>
            <a href="/recipe/${recipes[i].name.replaceAll(' ', '-').toLowerCase()}" target="_blank" class="recipe_link">
              <span>See Recipe</span>
              <svg viewBox="0 0 448 512"><path d="M246.6 233.4l-160-160c-12.5-12.5-32.75-12.5-45.25 0s-12.5 32.75 0 45.25L178.8 256l-137.4 137.4c-12.5 12.5-12.5 32.75 0 45.25C47.63 444.9 55.81 448 64 448s16.38-3.125 22.62-9.375l160-160C259.1 266.1 259.1 245.9 246.6 233.4zM438.6 233.4l-160-160c-12.5-12.5-32.75-12.5-45.25 0s-12.5 32.75 0 45.25L370.8 256l-137.4 137.4c-12.5 12.5-12.5 32.75 0 45.25C239.6 444.9 247.8 448 256 448s16.38-3.125 22.62-9.375l160-160C451.1 266.1 451.1 245.9 438.6 233.4z"></path></svg>
            </a>
          </div>
        </div>
      `;
    }
  }
  catch (err) {
    document.getElementById("sec_recipes").remove();
  }
});

const swiper_recipes = new Swiper(".swiper_recipes", {
  spaceBetween: 16,
  loop: true,
  speed: 300,
  shortswipes: false,
  threshold: 4,
  pagination: {
    el: ".swiper_recipes_pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".swiper_recipes_button_next",
    prevEl: ".swiper_recipes_button_prev",
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