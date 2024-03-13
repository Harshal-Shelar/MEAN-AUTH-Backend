import express  from "express";
import { addHistory, getHistoryList } from "../controllers/history.controller.js";

const router = express.Router();

router.post("/add-history", addHistory);
router.get("/get-history", getHistoryList);

export default router;