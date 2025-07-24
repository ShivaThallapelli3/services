// routes/apiRoutes.js
import express from "express";
import { register, login } from "../controllers/authController.js";
import { addContact, deleteContact, getContacts } from "../controllers/contactController.js";
import { sendSOS } from "../controllers/sosController.js";
import { authenticate } from "../middleware/auth.js";
import { getProfile, updateProfile } from "../controllers/userController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.use(authenticate);

router.get("/profile", getProfile); // GET /api/user/profile
router.post("/profile/update",updateProfile);

router.post("/contacts", addContact);
router.get("/contacts", getContacts);
router.delete("/contact/delete/:contactId",deleteContact);
router.post("/sos", sendSOS);

export default router;
