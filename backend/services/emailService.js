import nodemailer from "nodemailer";

// Create a transporter object using your Gmail account
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Your App Password
  },
});

/**
 * Sends an email.
 * @param {string} to - The recipient's email address.
 * @param {string} subject - The subject of the email.
 * @param {string} text - The plain text body of the email.
 */
export async function sendEmail(to, subject, text) {
  const mailOptions = {
    from: `"SOS Alert" <${process.env.EMAIL_USER}>`, // sender address
    to, // list of receivers
    subject, // Subject line
    text, // plain text body
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${to}`);
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error);
    // Optionally re-throw the error to be handled by the controller
    throw error;
  }
}
