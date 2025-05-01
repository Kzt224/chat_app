import express from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import { getMessagebyUser,getUserForSidebar,sendMessage } from "../controller/message.controller.js";

const router = express.Router();

router.get("/users", protectedRoute, getUserForSidebar);
router.get("/:id", protectedRoute, getMessagebyUser);
router.post("/send/:id",protectedRoute,sendMessage);

export default router;