import express from "express";
import { addCommentToPost, createPost, deletePost, getUserPosts, addReactionToPost, getPosts, getFriendsPosts } from "../controllers/post.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();


router.post("/create", protectRoute, createPost);
router.get("/:id", protectRoute, getUserPosts);
router.delete("/delete/:postId", protectRoute, deletePost);
router.put("/addReaction/:postId", protectRoute, addReactionToPost);
router.put("/addComment/:postId", protectRoute, addCommentToPost);
router.get("/all", protectRoute, getPosts);
router.get("/friends/:userId", protectRoute, getFriendsPosts);


export default router;