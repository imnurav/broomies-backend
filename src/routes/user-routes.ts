import {
  createUser,
  userLogin,
  getUserById,
} from "../controllers/user-controller";
import express from "express";

const router = express.Router();
router.post("/user", createUser);
router.post("/login", userLogin);
router.get("/user/:id", getUserById);

export default router;
