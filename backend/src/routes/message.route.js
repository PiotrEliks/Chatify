import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getUsersForSidebar, getMessages, sendMessage, getLastMessage, markMessageAsSeen, getConversationDetails } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/message/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);
router.get("/lastMessage", protectRoute, getLastMessage);
router.put("/markAsSeen", protectRoute, markMessageAsSeen);
router.get("/conversation/:conversationId", protectRoute, getConversationDetails);

export default router;