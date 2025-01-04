const nodemailer = require("nodemailer");

// Step 1: Create a transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // You can also use 'outlook', 'yahoo', or your custom SMTP service
  auth: {
    user: "sandropapiashvili@gmail.com", // Your email
    pass: "gjpr lqtk yxdk pmsu", // Your email password or app-specific password
  },
});

// Step 2: Define the sendMail function
const sendMail = async (text, sendTo, subject) => {
  const mailOptions = {
    from: "sandropapiashvili@gmail.com", // Sender address
    to: sendTo,
    subject: subject, // Subject line
    text, // Plain text body
  }; 

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return info; // Return the info for further use if needed
  } catch (error) {
    console.error("Error while sending email:", error);
    throw error; // Re-throw the error to handle it in the caller
  }
}; 

module.exports = { sendMail };
