import FormData from "form-data"
import Mailgun from "mailgun.js"

const mailgun = new Mailgun(FormData)
const mg = mailgun.client({
    username: "api",
    key: process.env.MAILGUN_API_KEY || "",
    url: process.env.MAILGUN_URL, // Optional
})

const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN || ""
const FROM_EMAIL = process.env.FROM_EMAIL || `noreply@${MAILGUN_DOMAIN}`

export async function sendVerificationEmail(to: string, code: string) {
    try {
        const data = await mg.messages.create(MAILGUN_DOMAIN, {
            from: FROM_EMAIL,
            to: [to],
            subject: "Verify your AIent account",
            text: `Your verification code is: ${code}`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to AIent! 👋</h2>
          <p style="color: #666; font-size: 16px;">Please use the following code to verify your account:</p>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <span style="font-size: 32px; letter-spacing: 8px; font-weight: bold; color: #333;">${code}</span>
          </div>
          <p style="color: #666; font-size: 14px;">This code will expire in 10 minutes.</p>
          <p style="color: #666; font-size: 14px;">If you didn't request this verification, please ignore this email.</p>
        </div>
      `,
        })

        return { success: true, data }
    } catch (error) {
        console.error("Failed to send verification email:", error)
        if (error.response) {
            console.error("Response data:", error.response.data)
            console.error("Response status:", error.response.status)
            console.error("Response headers:", error.response.headers)
        }
        return { success: false, error }
    }
}

