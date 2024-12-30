// Get elements
const inp_order_id = document.getElementById('inp_order_id');
const inp_name = document.getElementById('inp_name');
const inp_review = document.getElementById('inp_review');
const inp_img = document.getElementById('inp_img');
const img_preview = document.getElementById('img_preview');
const btn_remove_img = document.getElementById('btn_remove_img');
const stars_cursor_events_container = document.getElementById('stars_cursor_events_container');
const stars_container = document.getElementById('stars_container');
const error_order_id = document.getElementById('error_order_id');
const error_review = document.getElementById('error_review');
const error_img = document.getElementById('error_img');
const review_form = document.getElementById('review_form');
const btn_submit_review = document.getElementById('btn_submit_review');
const sec_write_review = document.getElementById('sec_write_review');
var inp_review_has_error = false;
var inp_order_id_has_error = false;



// Show an error message for the order ID input
function createOrderIDError(msg) {
  error_order_id.innerText = msg;
  inp_order_id.classList.add("error_border");
  inp_order_id_has_error = true;
  inp_order_id.scrollIntoView({          
    behavior: 'auto', 
    block: 'center', 
    inline: 'center' 
  });
}

// Show an error message for the review input
function createReviewError(msg) {
  error_review.innerText = msg;
  inp_review.classList.add("error_border");
  inp_review_has_error = true;
  inp_review.scrollIntoView({          
    behavior: 'auto', 
    block: 'center', 
    inline: 'center' 
  });
}

// Show an error message for the image input
function createImageError(msg) {
  error_img.innerText = msg;
  inp_img.value = null;
  img_preview.src = "#";
}

// Remove the error message for the order ID input
function removeOrderIDError() {
  error_order_id.innerText = "";
  inp_order_id.classList.remove("error_border");
  inp_order_id_has_error = false;
}

// Remove the error message for the review input
function removeReviewError() {
  error_review.innerText = "";
  inp_review.classList.remove("error_border");
  inp_review_has_error = false;
}

// Remove the error message for the image input
function removeImageError() {
  error_img.innerText = "";
}



// Handle when an image is inputted
inp_img.addEventListener('change', () => {
  if (inp_img.value == "") return;
  removeImageError();
  var fileName = inp_img.value;
  var fileType = fileName.substr(fileName.lastIndexOf(".") + 1, fileName.length).toLowerCase();
  if (fileType !== "jpg" && fileType !== "jpeg" && fileType !== "png" && fileType !== "gif" && fileType !== "webp") {
   createImageError('File type must be ".jpg", ".jpeg", ".png", ".gif", or ".webp"');
   return;
  }
  const [file] = inp_img.files;
  if (file) {
    img_preview.src = URL.createObjectURL(file);
  }
});

btn_remove_img.addEventListener('click', () => {
  inp_img.value = null;
  img_preview.src = "#";
});

inp_review.addEventListener('focus', () => {
  if (!inp_review_has_error) return;
  removeReviewError();
});

inp_order_id.addEventListener('focus', () => {
  if (!inp_order_id_has_error) return;
  removeOrderIDError();
});



// Handle the stars rating system
var current_rating = stars_container.getAttribute("data-rating");
var rating;
stars_cursor_events_container.addEventListener('click', (e) => {
  rating = Math.round(e.target.getAttribute("data-rating"));
  if (current_rating == rating) return;
  stars_container.setAttribute("data-rating", rating);
  current_rating = rating;
  e.target.blur();
});

var current_hovered_rating = 0;
var hovered_rating;
stars_cursor_events_container.addEventListener('mousemove', (e) => {
  hovered_rating = Math.round(e.target.getAttribute("data-rating"));
  if (current_hovered_rating == hovered_rating) return;
  stars_container.setAttribute("data-hovered-rating", hovered_rating);
  current_hovered_rating = hovered_rating;
});

stars_cursor_events_container.addEventListener('mouseenter', (e) => {
  hovered_rating = Math.round(e.target.getAttribute("data-rating"));
  stars_container.setAttribute("data-hovered-rating", hovered_rating);
  current_hovered_rating = hovered_rating;
});

stars_cursor_events_container.addEventListener('mouseout', () => {
  stars_container.removeAttribute("data-hovered-rating");
});

stars_cursor_events_container.addEventListener('focusin', (e) => {
  if (e.target.tagName !== 'BUTTON') return;
  hovered_rating = Math.round(e.target.getAttribute("data-rating"));
  stars_container.setAttribute("data-hovered-rating", hovered_rating);
  current_hovered_rating = hovered_rating;
});

stars_cursor_events_container.addEventListener('focusout', (e) => {
  stars_container.removeAttribute("data-hovered-rating");
});



// Show the file size in a human readable format
function formatBytes(bytes, decimals = 0) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}



// Submit the review
var timeout_submit_review = false;
review_form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  if (timeout_submit_review) return;
  timeout_submit_review = true;
  
  removeImageError();
  removeReviewError();
  removeOrderIDError();
  
  if (inp_order_id.value === "") {
    createOrderIDError("Required.");
    timeout_submit_review = false;
    return;
  }
  if (inp_review.value === "") {
    createReviewError("Required.");
    timeout_submit_review = false;
    return;
  }
  btn_submit_review.classList.add("clicked");
  
  var data = new FormData();
  data.append("order_id", inp_order_id.value);
  data.append("name", inp_name.value);
  data.append("review", inp_review.value);
  data.append("img", inp_img.files[0]);
  data.append("rating", current_rating);

  const result = await fetch('/write-review/submit-review', {
    method: 'POST',
    body: data,
  }).then(res => res.json())

  timeout_submit_review = false;
  btn_submit_review.classList.remove("clicked");

  if (result.error) {
    if (result.error === "invalid order id") {
      createOrderIDError("Invalid order ID.");
      return;
    }
    if (result.error === "review already submitted") {
      createOrderIDError("You have already submitted a review for this order.");
      return;
    }
    if (result.error === "empty review") {
      createReviewError("Required.");
      return;
    }
    if (result.error === "file size limit exceeded") {
      createImageError(`File size limit exceeded. The file size must be lower than ${formatBytes(result.fileSizeLimit)}.`);
      return;
    }
    if (result.error === "file type not allowed") {
      createImageError('File type must be ".jpg", ".jpeg", ".png", ".gif", or ".webp"');
      return;
    }
    if (result.error === "compressed size limit exceeded") {
      createImageError(`Failed to compress image to an allowed file size lower than ${formatBytes(result.compressedSizeLimit)}. Please try again with a smaller image.`);
      return;
    }
    alert("unknown error");
    return;
  }

  if (result.success) {
    sec_write_review.classList.add("submitted");
    window.scrollTo(0, 0);
  }
   
});



// feedback section
class Question_FB {
  constructor(btn_container, stars_container) {
    this.btn_container = document.getElementById(btn_container);
    this.stars_container = document.getElementById(stars_container);
    this.real_rating = null;
    
    // Clicking event
    this.cur_rating = this.stars_container.getAttribute("data-rating");
    this.new_rating;
    this.btn_container.addEventListener('click', (e) => {
      this.new_rating = Math.round(e.target.getAttribute("data-rating"));
      if (this.real_rating != null && this.cur_rating == this.new_rating) {
        this.stars_container.setAttribute("data-not-answered", '');
        this.cur_rating = 5
        this.real_rating = null;
        this.stars_container.setAttribute("data-rating", this.cur_rating);
        e.target.blur();
        return;
      } 
      this.stars_container.setAttribute("data-rating", this.new_rating);
      this.stars_container.removeAttribute("data-not-answered");
      this.cur_rating = this.new_rating;
      this.real_rating = this.new_rating;
      e.target.blur();
    });
    
    // Hovering events
    this.cur_hovered_rating = 0;
    this.new_hovered_rating;
    this.btn_container.addEventListener('mousemove', (e) => {
      this.new_hovered_rating = Math.round(e.target.getAttribute("data-rating"));
      if (this.cur_hovered_rating == this.new_hovered_rating) return;
      this.stars_container.setAttribute("data-hovered-rating", this.new_hovered_rating);
      this.cur_hovered_rating = this.new_hovered_rating;
    });
    
    this.btn_container.addEventListener('mouseenter', (e) => {
      this.new_hovered_rating = Math.round(e.target.getAttribute("data-rating"));
      this.stars_container.setAttribute("data-hovered-rating", this.new_hovered_rating);
      this.cur_hovered_rating = this.new_hovered_rating;
    });
    
    this.btn_container.addEventListener('mouseout', () => {
      this.stars_container.removeAttribute("data-hovered-rating");
    });

    // Focusing events
    this.btn_container.addEventListener('focusin', (e) => {
      if (e.target.tagName !== 'BUTTON') return;
      this.new_hovered_rating = Math.round(e.target.getAttribute("data-rating"));
      this.stars_container.setAttribute("data-hovered-rating", this.new_hovered_rating);
      this.cur_hovered_rating = this.new_hovered_rating;
    });
    
    this.btn_container.addEventListener('focusout', (e) => {
      this.stars_container.removeAttribute("data-hovered-rating");
    });
  }

  getRating() {
    return this.real_rating;
  }
}



// Get elements
const fb_question_1 = new Question_FB("stars_cursor_events_container_1", "stars_container_1");
const fb_question_2 = new Question_FB("stars_cursor_events_container_2", "stars_container_2");
const fb_question_3 = new Question_FB("stars_cursor_events_container_3", "stars_container_3");
const fb_question_4 = new Question_FB("stars_cursor_events_container_4", "stars_container_4");
const form_feedback = document.getElementById('form_feedback');
const feedback_error_text = document.getElementById('feedback_error_text');
const btn_submit_feedback = document.getElementById('btn_submit_feedback');
let timeout_submit_feedback = false;



// Submit the feedback
form_feedback.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (timeout_submit_feedback) return;
  timeout_submit_feedback = true;
  btn_submit_feedback.classList.add("clicked");
  
  const result = await fetch('/contact/submit-feedback', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      q1: fb_question_1.getRating(),
      q2: fb_question_2.getRating(),
      q3: fb_question_3.getRating(),
      q4: fb_question_4.getRating(),
      where: document.getElementById("inp_where").value,
      comment: document.getElementById("inp_comment").value,
    })
  }).then(res => res.json())
  
  timeout_submit_feedback = false;
  btn_submit_feedback.classList.remove("clicked");
  btn_submit_feedback.blur();

  if (result.error === "nothing submitted") {
    feedback_error_text.innerText = "Nothing filled out, please answer at least one question.";
  }
  else if (result.error === "feedback already submitted") {
    feedback_error_text.innerText = "You have already submitted your feedback.";
  }
  else if (result.error) {
    feedback_error_text.innerText = "Unknown error - failed to submit. Please try again later.";
  }
  if (result.success) {
    form_feedback.parentNode.classList.add("submitted");
    form_feedback.parentNode.scrollIntoView({          
      behavior: 'auto', 
      block: 'center', 
      inline: 'center' 
    });
  }
});