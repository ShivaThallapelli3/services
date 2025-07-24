// controllers/contactController.js
import mongoose from "mongoose";
import User from "../models/User.js";

export async function addContact(req, res) {
  const { contact_name, contact_phone, contact_email } = req.body;
  if (!contact_name || !contact_phone) {
    return res
      .status(400)
      .json({ error: "Name and Phone are required for contact" });
  }

  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.contacts.push({ contact_name, contact_phone, contact_email });
    await user.save();

    res.status(201).json({
      message: "Contact added",
      contact: user.contacts[user.contacts.length - 1],
    });
  } catch (err) {
    console.error("Add contact error:", err);
    res.status(500).json({ error: "Server error" });
  }
}

export async function getContacts(req, res) {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user.contacts);
  } catch (err) {
    console.error("Get contacts error:", err);
    res.status(500).json({ error: "Server error" });
  }
}

export async function deleteContact(req, res) {
  const { contactId } = req.params;
  const userId = req.user.userId;
  // Logging for debugging
  const user = await User.findById(userId);
  console.log("DELETE /contact/delete hit. contactId:", contactId);
  console.log("User object:", req.user);

  if (!contactId) {
    return res.status(400).json({ error: "Missing contact ID" });
  }
  console.log(
    "Trying to delete contactId:",
    contactId,
    "for user:",
    userId,
    "User contacts:",
    user.contacts.forEach(c => 
  console.log(c._id, typeof c._id, c._id instanceof mongoose.Types.ObjectId)
  ));
console.log("Contact to delete:", contactId);
const exists = user.contacts.some(c => c._id.toString() === contactId);
console.log("Exists in contacts?", exists);
  try {
    const result = await User.updateOne(
      { _id: userId }, // or req.user.id, check your middleware
     { $pull: { contacts: { _id: new mongoose.Types.ObjectId(contactId)}} }
    );

    if (result.modifiedCount === 0) {
      return res
        .status(404)
        .json({ error: "Contact not found or already deleted" });
    }

    res.status(200).json({ message: "Contact deleted successfully" });
  } catch (err) {
    console.error("Delete contact error:", err);
    res.status(500).json({ error: "Server error" });
  }
}
