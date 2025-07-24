import User from "../models/User.js";
import { sendEmail } from "../services/emailService.js";
import { sendSms } from "../services/smsService.js";

// Helper function to format phone numbers to E.164
function formatPhoneNumber(phone) {
  // Simple version for Indian numbers: assumes 10 digits and adds +91
  // You can make this more robust for other countries if needed.
  if (phone && phone.length === 10 && !phone.startsWith('+')) {
    return `+91${phone}`;
  }
  // If it's already formatted, return it as is
  if (phone && phone.startsWith('+')) {
    return phone;
  }
  // Return null if format is invalid
  return null;
}

export async function sendSOS(req, res) {
  try {
    const { lat, lng } = req.body;
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // FIX 1: Removed .populate()
    const user = await User.findById(req.user.userId);

    if (!user) return res.status(404).json({ error: "User not found" });
    if (!user.contacts || user.contacts.length === 0) {
      return res.status(400).json({ error: "No emergency contacts set." });
    }

    const googleMapsLink = `https://maps.google.com/?q=${lat},${lng}`;
    const sosMessage = `URGENT SOS from ${user.name}! They need help at this location: ${googleMapsLink}`;
    const emailSubject = `SOS Alert from ${user.name}`;

    const notificationPromises = [];

    user.contacts.forEach((contact) => {
      if (contact.contact_email) {
        notificationPromises.push(
          sendEmail(contact.contact_email, emailSubject, sosMessage)
        );
      }

      // FIX 2: Format the phone number before sending
      const formattedPhone = formatPhoneNumber(contact.contact_phone);
      if (formattedPhone) {
        notificationPromises.push(
          sendSms(formattedPhone, sosMessage)
        );
      } else {
        console.warn(`Invalid phone number format for contact: ${contact.contact_name}. Skipping SMS.`);
      }
    });

    await Promise.allSettled(notificationPromises);
    res.json({ message: "SOS alerts have been dispatched." });

  } catch (err) {
    console.error("SOS Controller error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
