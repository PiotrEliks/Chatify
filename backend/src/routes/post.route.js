import express from "express";
import { addCommentToPost, createPost, deletePost, getUserPosts, addReactionToPost, deleteReactionFromPost, getPosts, getFriendsPosts, getPost } from "../controllers/post.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();


router.post("/create", protectRoute, createPost);
router.get("/user/:userId", protectRoute, getUserPosts);
router.put("/delete/:postId", protectRoute, deletePost);
router.put("/addReaction/:postId", protectRoute, addReactionToPost);
router.put("/deleteReaction/:postId", protectRoute, deleteReactionFromPost);
router.put("/addComment/:postId", protectRoute, addCommentToPost);
router.get("/all", protectRoute, getPosts);
router.get("/friends/:userId", protectRoute, getFriendsPosts);
router.get("/post/:postId", protectRoute, getPost);


export default router;