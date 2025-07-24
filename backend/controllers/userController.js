import User from "../models/User.js";

// This controller expects req.user.userId from the JWT middleware
export async function getProfile(req, res) {
  const user = await User.findById(req.user.userId).select("-password_hash"); // don't return password hash!
  if (!user) return res.status(404).json({ error: "User not found" });

  res.json({
    name: user.name,
    email: user.email,
    phone: user.phone,
    contacts: user.contacts
  });
}

// Assuming: import User from '../models/User'
export async function updateProfile(req, res) {
  try {
    const userId = req.user.userId; // comes from auth middleware
    const { name, email, phone } = req.body;
    // Update user in database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, phone },
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    return res.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}
