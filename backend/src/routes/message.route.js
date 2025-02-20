import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getUsersForSidebar, getMessages, sendMessage, getConversation } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/message/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);
router.get("/conversation", protectRoute, getConversation);

export default router;