// models/User.js
import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
 
  contact_name: { type: String, required: true },
  contact_phone: { type: String, required: true },
  contact_email: { type: String },
});

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password_hash: { type: String, required: true },
  name: String,
  phone: String,
  contacts: [contactSchema],
});

const User = mongoose.model("User", userSchema);
export default User;
