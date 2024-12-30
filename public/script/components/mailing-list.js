// Mailing list form component
class MailingList {
  
  // Constructor
  constructor() {
  
    this.elmForm = document.getElementById("form_mailing_list");
    this.elmInpEmail = document.getElementById("inp_email_ml");
    this.elmBtnSubscribe = document.getElementById("btn_join_ml");
    this.elmBtnUnsubscribe = document.getElementById("btn_unsubscribe");
    this.elmSubmitted = document.getElementById('submitted_mail');
    this.submitTimeout = false;
    this.EMAIL = "";

    if (this.elmForm.classList.contains("submitted")) {
      this.elmBtnSubscribe.innerText = "Change";
      this.EMAIL = this.elmInpEmail.value;
    }

    this.elmForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (this.elmForm.classList.contains("submitted")) {
        this.setEditState();
      }
      else if (this.elmInpEmail.value === "") {
        await this.unsubscribe();
      }
      else {
        await this.subscribe(this.elmInpEmail.value);
      }
    });

    this.elmBtnUnsubscribe.addEventListener('click', async () => {
      return await this.unsubscribe();
    });

  }

  // Sets the saved styles for the form
  setSavedState(email) {
    this.elmForm.classList.add("submitted");
    this.elmSubmitted.innerText = email;
    this.EMAIL = email;
    this.elmBtnSubscribe.innerText = "Change";
    this.elmBtnUnsubscribe.classList.add("submitted");
    return null;
  }

  // Sets the editing styles for the form
  setEditState() {
    this.elmForm.classList.remove("submitted");
    this.elmInpEmail.value = this.EMAIL;
    this.elmBtnSubscribe.innerText = "Join";
    this.elmBtnUnsubscribe.classList.remove("submitted");
    return null;
  }

  // Subscribes to the mailing list
  async subscribe(email) {
    
    if (this.submitTimeout) {
      return;
    }
    this.submitTimeout = true;
    
    const result = await fetch('/mailing-list/subscribe', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: email })
    }).then(res => res.json())
    
    setTimeout(() => {
      this.submitTimeout = false;
    }, 500);
    
    if (result.success) {
      this.setSavedState(email);
    }

    if (result.error) {
      alert("Failed to submit email.\nPlease try again later ...");
    }

  }

  // Unsubscribes from the mailing list
  async unsubscribe() {
    
    if (this.submitTimeout) {
      return;
    }
    this.submitTimeout = true;

    const result = await fetch('/mailing-list/unsubscribe', {
      method: 'POST',
    }).then(res => res.json())
    
    setTimeout(() => {
      this.submitTimeout = false;
    }, 500);
    
    if (result.success) {
      this.EMAIL = "";
      this.setEditState();
    }

    if (result.error) {
      alert("Failed to unsubscribe.\nPlease try again later, or contact us on our contact page.");
    }

  }

}



// Initialize the mailing list form
const myFooterEmailForm = new MailingList();