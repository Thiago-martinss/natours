const nodemailer = require('nodemailer');
const pug = require('pug');
const { convert } = require('html-to-text');
const Transport = require("nodemailer-brevo-transport");

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.name = user.firstName;
    this.url = url;
    this.from = `Thiago Martins <${process.env.EMAIL_FROM}>`;
    //this.subject = 'Your Tour Booking Confirmation';
    /*this.message = `
      Hi ${this.name},
      Thank you for booking a tour with us. Your booking reference is ${this.url}.
      Please check your email for more details.
      Best regards,
      Tour Agency
    `;
    */
  }
 newTransport() {
      if (process.env.NODE_ENV === 'production') {
        //SendinBlue now called brevo
        return nodemailer.createTransport(
          new Transport({
            apiKey: `${process.env.SEND_IN_BLUE_API_KEY}`,
          })
        );
      }
      return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD
        }
      });
  }

    
   async send(template, subject) {
    //1) Render HTML based on the template
    const html = pug.renderFile(`${__dirname}/../views/emails/${template}.pug`, 
      { firstName: this.firstName, url: this.url, subject });

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: convert(html)
    };

   await this.newTransport().sendMail(mailOptions)
  }

  async sendWelcome() {
    await this.send('Welcome', 'Welcome to the Natours Family!');
  }

  async sendPasswordReset() {
    await this.send('passwordReset', 'Password Reset');
  }
 
};



