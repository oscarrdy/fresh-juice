// FAQ section questions
const questions = document.getElementsByClassName("content_box");
for (i = 0; i < questions.length; i++) {
  questions[i].addEventListener("click", function(e){
    if (e.target.classList.contains("answer") || e.target.classList.contains("answer_p")) return;
    if (this.classList.contains("open")) {
      this.classList.remove("open");
    } else {
      Array.from(questions).forEach(elm => {
        elm.classList.remove("open");
      });
      this.classList.add("open");
    }
  });
}

// FAQ section links
const question_links = document.getElementsByClassName("question_link");
for (i = 0; i < question_links.length; i++) {
  question_links[i].addEventListener("focus", function(){
    Array.from(questions).forEach(elm => {
      elm.classList.remove("open");
    });
    this.parentNode.parentNode.parentNode.classList.add("open");
  });
}



// Contact section
const form_contact_us = document.getElementById('form_contact_us');
const error_name = document.getElementById('error_name');
const error_email = document.getElementById('error_email');
const error_question = document.getElementById('error_question');
const inp_name = document.getElementById('inp_name');
const inp_email_contact = document.getElementById('inp_email');
const inp_question = document.getElementById('inp_question');
const inp_mailing_list = document.getElementById('inp_mailing_list');
const btn_submit_question = document.getElementById('btn_submit_question');
var timeout_submit_question = false;

function createError(elm, msg) {
  elm.previousElementSibling.innerText = msg;
  elm.classList.add("error_border");
  elm.scrollIntoView({          
    behavior: 'auto', 
    block: 'center', 
    inline: 'center' 
  });
}

inp_name.addEventListener("focus", () => {
  inp_name.classList.remove("error_border");
  inp_name.previousElementSibling.innerText = "";
});
inp_email.addEventListener("focus", () => {
  inp_email.classList.remove("error_border");
  inp_email.previousElementSibling.innerText = "";
});
inp_question.addEventListener("focus", () => {
  inp_question.classList.remove("error_border");
  inp_question.previousElementSibling.innerText = "";
});

form_contact_us.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (timeout_submit_question) return;
  timeout_submit_question = true;
  btn_submit_question.classList.add("clicked");

  let name_val = inp_name.value;
  let email_val = inp_email_contact.value;
  let question_val = inp_question.value;
  let joined_ml = (inp_mailing_list.checked) ? true : false;

  if (inp_mailing_list.checked) {
    const ml_result = await myFooterEmailForm.submitEmail(email_val);
    if (ml_result.error) {
      inp_mailing_list.checked = false;
      joined_ml = false;
    }
  }

  const result = await fetch('/contact/submit-question', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      name: name_val,
      email: email_val,
      question: question_val,
      joined_ml: joined_ml,
    })
  }).then(res => res.json())

  timeout_submit_question = false;
  btn_submit_question.classList.remove("clicked");
  
  if (result.error) {
    if (result.error === "cooldown") {
      return createError(inp_question, `Please wait ${result.time} minutes before submitting another question.`);
    }
    if (result.error.includes("name required")) createError(inp_name, "please enter a name");
    if (result.error.includes("email required")) createError(inp_email, "please enter a valid email");
    if (result.error.includes("question required")) createError(inp_question, "please explain your question");
  }

  if (result.success) {
    form_contact_us.parentNode.classList.add("submitted");
    form_contact_us.parentNode.scrollIntoView({          
      behavior: 'auto', 
      block: 'center', 
      inline: 'center' 
    });
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

const fb_question_1 = new Question_FB("stars_cursor_events_container_1", "stars_container_1");
const fb_question_2 = new Question_FB("stars_cursor_events_container_2", "stars_container_2");
const fb_question_3 = new Question_FB("stars_cursor_events_container_3", "stars_container_3");
const fb_question_4 = new Question_FB("stars_cursor_events_container_4", "stars_container_4");
const form_feedback = document.getElementById('form_feedback');
const feedback_error_text = document.getElementById('feedback_error_text');
const btn_submit_feedback = document.getElementById('btn_submit_feedback');
let timeout_submit_feedback = false;

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
