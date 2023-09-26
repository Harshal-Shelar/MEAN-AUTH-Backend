import express from "express";
import { getAllUser, getById } from "../controllers/user.controller.js";
import { verifyAdmin, verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

router.get('/', verifyAdmin, getAllUser);

router.get('/:id', verifyUser, getById );

export default router;