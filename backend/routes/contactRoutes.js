// routes/contactRoutes.js
import express from "express";
import { addContact, getContacts } from "../controllers/contactController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticate); // protect all routes below

router.post("/", addContact);      // POST /api/contacts
router.get("/", getContacts);      // GET /api/contacts

export default router;
