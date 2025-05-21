import express from "express";
import { createUser, fetchUser, putUser } from "../controllers/userController.js";

const router= express.Router();

router.post("/", createUser);
router.get("/:id",fetchUser);
router.put("/:id", putUser);

export default router;