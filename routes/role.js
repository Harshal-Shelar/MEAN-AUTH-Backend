import express from 'express';
import { createRole, updateRole, deleteRole, getAll } from '../controllers/role.controller.js';
import { verifyAdmin } from '../utils/verifyToken.js';

const router = express.Router();

router.post('/create', verifyAdmin, createRole);

router.put("/update/:id",verifyAdmin, updateRole);

router.put("/update/:id", getAll);

router.delete("/deleteRole/:id", deleteRole);

export default router;