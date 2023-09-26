import express  from "express";
import { login, register, registerAdmin, resetPassword, sendEmail } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/register-Admin", registerAdmin);
router.post("/send-email", sendEmail);
router.post("/reset-password", resetPassword);

export default router;