import express  from "express";
import { addUser, deleteUser, getAllEmail, updateUser, updateUserbyId, userList } from "../controllers/product.controller.js";

const router = express.Router();

router.post("/add-user", addUser);
router.get("/user-list", userList);
router.get("/get-all-email", getAllEmail);
router.delete("/userDelete/:id", deleteUser);
router.put("/updateUser/:id", updateUser);
router.get("/userUpdate/:id", updateUserbyId);

export default router;