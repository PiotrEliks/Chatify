import express from "express";
import { addFriend, deleteFriend, sendRequest, acceptRequest, rejectRequest, getRequestStatus } from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();


router.put("/add/:id", protectRoute, addFriend);
router.put("/delete/:id", protectRoute, deleteFriend);
router.post("/friend-request", protectRoute, sendRequest);
router.post("/friend-request/:id/accept", protectRoute, acceptRequest);
router.post("/friend-request/:id/reject", protectRoute, rejectRequest);
router.get("/friend-request/status", protectRoute, getRequestStatus);

export default router;