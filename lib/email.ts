/**
 * Email utility functions for sending verification and password reset emails
 */

// Define a type for the error structure we're expecting
interface MailgunError {
  response?: {
    data?: any
    status?: number
    headers?: any
  }
  message?: string
}

/**
 * Sends a verification email to the user
 * @param email The recipient's email address
 * @param code The verification code
 * @returns Promise<boolean> indicating success or failure
 */
export async function sendVerificationEmail(email: string, code: string): Promise<boolean> {
  try {
    // Create URLSearchParams instead of FormData for compatibility with fetch
    const formData = new URLSearchParams()
    formData.append("from", `TradeGPT <${process.env.FROM_EMAIL}>`)
    formData.append("to", email)
    formData.append("subject", "Verify your TradeGPT account")
    formData.append("text", `Your verification code is: ${code}`)
    formData.append(
      "html",
      `
      <h1>Verify your TradeGPT account</h1>
      <p>Your verification code is: <strong>${code}</strong></p>
      <p>This code will expire in 15 minutes.</p>
    `,
    )

    // Send the email using Mailgun API
    const response = await fetch(`${process.env.MAILGUN_URL}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`api:${process.env.MAILGUN_API_KEY}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Failed to send email: ${response.statusText}`)
    }

    return true
  } catch (error: unknown) {
    console.error("Failed to send verification email:", error)

    // Type check the error before accessing its properties
    if (error && typeof error === "object" && "response" in error) {
      const mailgunError = error as MailgunError
      if (mailgunError.response) {
        console.error("Response data:", mailgunError.response.data)
        console.error("Response status:", mailgunError.response.status)
        console.error("Response headers:", mailgunError.response.headers)
      }
    }

    // Return false to indicate failure
    return false
  }
}

/**
 * Sends a password reset email to the user
 * @param email The recipient's email address
 * @param resetToken The password reset token
 * @param resetUrl The complete URL for password reset
 * @returns Promise<boolean> indicating success or failure
 */
export async function sendPasswordResetEmail(email: string, resetToken: string, resetUrl: string): Promise<boolean> {
  try {
    // Create URLSearchParams instead of FormData for compatibility with fetch
    const formData = new URLSearchParams()
    formData.append("from", `TradeGPT <${process.env.FROM_EMAIL}>`)
    formData.append("to", email)
    formData.append("subject", "Reset your TradeGPT password")
    formData.append("text", `Your password reset link: ${resetUrl}`)
    formData.append(
      "html",
      `
      <h1>Reset your TradeGPT password</h1>
      <p>Click the link below to reset your password:</p>
      <p><a href="${resetUrl}">Reset Password</a></p>
      <p>This link will expire in 15 minutes.</p>
    `,
    )

    // Send the email using Mailgun API
    const response = await fetch(`${process.env.MAILGUN_URL}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`api:${process.env.MAILGUN_API_KEY}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Failed to send email: ${response.statusText}`)
    }

    return true
  } catch (error: unknown) {
    console.error("Failed to send password reset email:", error)

    // Type check the error before accessing its properties
    if (error && typeof error === "object" && "response" in error) {
      const mailgunError = error as MailgunError
      if (mailgunError.response) {
        console.error("Response data:", mailgunError.response.data)
        console.error("Response status:", mailgunError.response.status)
        console.error("Response headers:", mailgunError.response.headers)
      }
    }

    // Return false to indicate failure
    return false
  }
}

