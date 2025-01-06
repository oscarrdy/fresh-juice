// Imports
const router = require("express").Router();
const nodemailer = require("nodemailer");
const User = require("../models/user-schema");
const Question = require("../models/question-schema");
const Feedback = require("../models/feedback-schema");
const { getUser } = require("../utils/user-data");
const { 
  allowed_currencies,
  logError,
  website_info
} = require("../utils/common-data");



// Contact page
router.get("/", getUser, async (req, res) => {
  res.render("contact", {
    website_info: website_info,
    allowed_currencies: allowed_currencies,
    user: req.user,
  });
});



// Submit a question
router.post("/submit-question", getUser, async (req, res) => {

  // Check if the user has submitted a question in the last 30 minutes to prevent spam
  if (req.user.questions) {
    if (req.user.questions.length > 0) {
      const lastQuestion = await Question.findById(req.user.questions[req.user.questions.length-1]);
      if (lastQuestion.createdAt > (Date.now() - 1000 * 60 * 30)) {
        return res.status(400).json({ 
          error: "cooldown",
          time: Math.round((lastQuestion.createdAt - (Date.now() - 1000 * 60 * 30)) / 60 / 1000)
        });
      }
    }
  }

  // Get the data from the request
  let name = req.body.name?.trim() || "";
  let email = req.body.email?.trim() || "";
  let question = req.body.question?.trim() || "";
  let joined_ml = req.body.joined_ml || false;

  // Check if the data is valid
  const error_array = [];
  if (!name) error_array.push("name required");
  if (!email) error_array.push("email required");
  if (!question) error_array.push("question required");
  if (error_array.length > 0) {
    return res.json({ 
      error: error_array
    });
  }

  // Submit the new question
  try {
    const newQuestion = await Question.create({
      name: name,
      email: email,
      question: question, 
      joined_ml: joined_ml,
    });
    // TODO: Purchase emailing hosting plan to send emails
    // sendQuestionByEmail(newQuestion);
    await User.findByIdAndUpdate( req.user.id, { $push: { 
      questions: newQuestion.id
    }});
    return res.json({ 
      success: true 
    });
  }

  // Handle errors
  catch (err) {
    await logError("Failed to submit question.", err);
    return res.status(500).json({ 
      error: "unknown"
    });
  }
  
});



// Submit feedback
router.post("/submit-feedback", getUser, async (req, res) => {

  // Validate the data
  if (req.body.where === "blank") req.body.where = "";
  if (!req.body.q1 && !req.body.q2 && !req.body.q3 && !req.body.q4 && !req.body.comment && !req.body.where) {
    return res.status(400).json({ 
      error: "nothing submitted"
    });
  }
  if (req.user.feedback.length > 0) {
    return res.status(400).json({
      error: "feedback already submitted"
    });
  }

  // Submit the feedback
  try {
    const newFeedback = await Feedback.create({
      q1: req.body.q1,
      q2: req.body.q2,
      q3: req.body.q3,
      q4: req.body.q4,
      where: req.body.where,
      comment: req.body.comment,
    });
    await User.findByIdAndUpdate( req.user.id, { $push: {
      feedback: newFeedback.id
    }});
    return res.json({
      success: true
    });
  }

  // Handle errors
  catch (err) {
    await logError("Failed to submit feedback.", err);
    return res.status(500).json({ 
      error: "unknown"
    });
  }

});



// Send a question by email
function sendQuestionByEmail(newQuestion) {
  const transporter = nodemailer.createTransport({
    service: "hotmail",
    auth: {
      user: process.env.EMAIL_NAME,
      pass: process.env.EMAIL_PASS
    },
  });
  const options = {
    from: process.env.EMAIL_NAME,
    to: process.env.EMAIL_NAME,
    replyTo: newQuestion.email,
    subject: `${website_info.name} - Question from: ${newQuestion.email}`,
    text: `${newQuestion.question}\n\n\nSend from:\n- ${newQuestion.name}\n- ${newQuestion.email}`,
  };
  transporter.sendMail(options, async (err, info) => {
    if (err) {
      await logError(`Failed to send question by email`, err);
    }
  });
}



// Exports
module.exports = router;