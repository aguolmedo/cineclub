import * as nodemailer from 'nodemailer';

export default class emailHelper {
  static transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'cineclubplay@gmail.com',
      pass: process.env.PASSWORD_MAIL,
    },
  });

  static async send_mail(
    from: string,
    to: string,
    subject: string,
    text: string,
    html: string,
  ) {
    try {
      await this.transporter.verify();
      console.log('Ready for sending email');

      await this.transporter.sendMail({
        from: from,
        to: to,
        subject: subject,
        text: text,
        html: html,
      });

      console.log('Email sent.');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}
