import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail', // Use Gmail as the email service
  auth: {
    user: 'imrajesh2005@gmail.com', // Your email address
    pass: 'dfcr fggb kqkl ncjk', // Your email password or app password
  },
});

export const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: 'imrajesh2005@gmail.com', // Sender's email address
    to, // Recipient's email address
    subject, // Email subject
    text, // Email body
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};