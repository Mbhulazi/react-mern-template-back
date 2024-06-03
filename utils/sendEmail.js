const nodemailer = require("nodemailer");
const MailGen = require("mailgen");

const sendEmail = async (subject, send_to, template, reply_to, cc) => {
  // create email transporter

  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: process.env.EMAIL_HOST,
    port: 587,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  
  //create template with mailgen
  const mailGenerator = new MailGen({
    theme: "salted",
    product: {
      name: "SK Mern template",
      link: "https://",
    },
  });

  const emailTemplate = mailGenerator.generate(template);
  require("fs").writeFileSync("preview.html", emailTemplate, utf8);

  //options for sending email
const options = {
    from: process.env.EMAIL_USER,
    to: send_to,
    reply: reply_to,
    subject,
    html: emailTemplate,
    cc,
};

// Send email
transporter.sendMail(options, function (err,info) {
  if (err) {
    console.log(err);
  } else {
    console.log(info);
  }
})
};

module.exports = sendEmail;