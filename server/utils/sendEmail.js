const nodemailer = require('nodemailer')
const config = require('../config/config')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.email.user,
    pass: config.email.pass
  }
})

const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"EventBook" <${config.email.user}>`,
      to,
      subject,
      html
    })
    console.log(`Email sent to ${to}`)
  } catch (err) {
    console.error('Email send failed:', err.message)
    // Don't throw — email failure should never break the booking flow
  }
}

module.exports = sendEmail
