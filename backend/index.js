import "./db.js";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import serviceRoutes from "./routes/serviceRoutes.js";
import currLocRoutes from "./routes/currLocRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/services", serviceRoutes);
app.use("/api/location", currLocRoutes);
app.use("/api/user", userRoutes);
app.use("/api/contacts", contactRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
