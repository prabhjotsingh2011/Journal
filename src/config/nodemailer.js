const nodemailer = require('nodemailer');

// Function to send an email notification
const sendNotificationEmail = async (recipientEmail, subject, message) => {
  try {
    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
      // Specify your email provider configuration here
      service: 'gmail',
      auth: {
        user: 'fake.email.20112002@gmail.com',  //we can put this in .env file
        pass: 'ikikrnkecboddsgo'  //this is not the original mail. its a demo one i created for this task
      }
    });

    // Compose the email message
    const mailOptions = {
      from: 'fake.email.20112002@gmail.com',
      to: recipientEmail,
      subject,
      text: message
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    // console.log('Notification email sent successfully');
  } catch (error) {
    console.error('Error sending notification email:', error);
  }
};

module.exports=sendNotificationEmail;