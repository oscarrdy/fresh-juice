// Variables
const form_admin_login = document.getElementById('form_admin_login');
const inp_admin_password = document.getElementById('inp_admin_password');
const admin_error_text = document.getElementById('admin_error_text');
var admin_login_timeout = false;



// Login form submission
form_admin_login.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (admin_login_timeout) return;
  admin_login_timeout = true;
  admin_error_text.innerText = "";

  const result = await fetch('/admin/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ pass: inp_admin_password.value })
  }).then(res => res.json())
  
  admin_login_timeout = false;
  if (result.error === "incorrect password") {
    admin_error_text.innerText = "Incorrect password.";
  }
  if (result.error === "unknown error"){
    admin_error_text.innerText = "Unknown error.";
  }
  if (result.success) {
    window.location = "/admin";
  }
});