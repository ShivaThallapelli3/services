import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

/**
 * Sends an SMS message.
 * @param {string} to - The recipient's phone number in E.164 format (e.g., +14155552671).
 * @param {string} body - The message content.
 */
export async function sendSms(to, body) {
  try {
    await client.messages.create({
      body,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    });
    console.log(`SMS sent successfully to ${to}`);
  } catch (error) {
    console.error(`Failed to send SMS to ${to}:`, error);
    throw error;
  }
}
