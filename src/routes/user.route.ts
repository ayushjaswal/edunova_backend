import express from "express";
import { addUser, getAllUsers } from "../controller/user.controller.js";
const router = express.Router();

router.get("/", getAllUsers);
router.post("/add-user", addUser)

export default router;