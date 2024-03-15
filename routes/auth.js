import express  from "express";
import { getRegUser, getRegUserId, login, register, registerAdmin, resetPassword, sendEmail, updateRegDetails } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/register-Admin", registerAdmin);
router.post("/send-email", sendEmail);
router.post("/reset-password", resetPassword);
router.get("/get-reg-user", getRegUser);
router.put("/update-reg-details/:id", updateRegDetails);
router.get("/get-reg-userId/:id", getRegUserId);

export default router;