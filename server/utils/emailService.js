const nodemailer = require("nodemailer")

// Create reusable transporter
const createTransporter = () => {
  // For development, use ethereal email (fake SMTP)
  // For production, replace with real SMTP credentials (Gmail, SendGrid, etc.)
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.ethereal.email",
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER || "your-email@gmail.com",
      pass: process.env.SMTP_PASS || "your-password",
    },
  })
}

// Send email notification
const sendEmailNotification = async (to, subject, htmlContent) => {
  try {
    const transporter = createTransporter()

    const mailOptions = {
      from: `"Student Activity System" <${process.env.SMTP_USER || "noreply@studentactivities.com"}>`,
      to: to,
      subject: subject,
      html: htmlContent,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log("✅ Email sent:", info.messageId)
    console.log("Preview URL:", nodemailer.getTestMessageUrl(info))
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error("❌ Email sending failed:", error)
    return { success: false, error: error.message }
  }
}

// Send activity registration confirmation
const sendActivityRegistrationEmail = async (userEmail, userName, activityName) => {
  const subject = "Activity Registration Confirmation"
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #6b7280;">Activity Registration Successful!</h2>
      <p>Hello <strong>${userName}</strong>,</p>
      <p>You have successfully registered for the activity:</p>
      <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin: 0; color: #374151;">${activityName}</h3>
      </div>
      <p>You will receive more details about the activity soon.</p>
      <p style="color: #6b7280; margin-top: 30px;">Best regards,<br>Student Activity System</p>
    </div>
  `
  return await sendEmailNotification(userEmail, subject, htmlContent)
}

// Send attendance confirmation email
const sendAttendanceEmail = async (userEmail, userName, eventName, pointsEarned) => {
  const subject = "Attendance Recorded - Points Awarded!"
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #16a34a;">Attendance Confirmed! 🎉</h2>
      <p>Hello <strong>${userName}</strong>,</p>
      <p>Your attendance for the following event has been recorded:</p>
      <div style="background-color: #f0fdf4; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin: 0 0 10px 0; color: #166534;">${eventName}</h3>
        <p style="margin: 0; font-size: 24px; color: #16a34a;"><strong>+${pointsEarned} Points</strong></p>
      </div>
      <p>Keep participating in activities to earn more points!</p>
      <p style="color: #6b7280; margin-top: 30px;">Best regards,<br>Student Activity System</p>
    </div>
  `
  return await sendEmailNotification(userEmail, subject, htmlContent)
}

// Send general notification email
const sendGeneralNotification = async (userEmail, userName, title, message) => {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #6b7280;">${title}</h2>
      <p>Hello <strong>${userName}</strong>,</p>
      <div style="background-color: #f9fafb; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p style="margin: 0; color: #374151;">${message}</p>
      </div>
      <p style="color: #6b7280; margin-top: 30px;">Best regards,<br>Student Activity System</p>
    </div>
  `
  return await sendEmailNotification(userEmail, title, htmlContent)
}

module.exports = {
  sendEmailNotification,
  sendActivityRegistrationEmail,
  sendAttendanceEmail,
  sendGeneralNotification,
}
