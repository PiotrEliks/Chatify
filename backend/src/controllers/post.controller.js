import Post from "../models/post.model.js";
import cloudinary from "../lib/cloudinary.js";
import User from "../models/user.model.js";

export const createPost = async (req, res) => {
  try {
    const { userId, text, image } = req.body;

    let imageUrl;
    if (image) {
      const uploadReponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadReponse.secure_url;
    }

    const newPost = new Post({
      userId,
      text,
      image: imageUrl,
    });

    await newPost.save();

    return res.status(200).json(newPost);
  } catch (error) {
    console.log("Error in createPost: ", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await Post.find(userId);

    return res.status(200).json(posts);
  } catch (error) {
    console.log("Error in getPosts: ", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;

    await Post.findByIdAndDelete(postId);

    return res.status(200).json({ message: "Post has been deleted successfully" });
  } catch (error) {
    console.log("Error in deletePost: ", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const addReactionToPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId, reactionType } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.reactions.push({ userId: userId, type: reactionType });
    await post.save();

    return res.status(200).json({ message: "Reaction has been added" });
  } catch (error) {
    console.log("Error in likePost: ", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const addCommentToPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { text, userId } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.comments.push({ userId: userId, text: text });
    await post.save();

    return res.status(200).json({ message: "Comment has been added" });
  } catch (error) {
    console.log("Error in commentPost: ", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    if (!posts) {
      return res.status(404).json({ message: 'Post not found' });
    }

    return res.status(200).json(posts);
  } catch (error) {
    console.log("Error in getPost: ", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getFriendsPosts = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const friendIds = user.friends;
    const posts = await Post.find({ userId: { $in: friendIds } })
      .sort({ createdAt: -1 });

    if (!posts) {
      return res.status(404).json({ message: 'Posts not found' });
    }

    return res.status(200).json(posts);
  } catch (error) {
    console.log("Error in getPost: ", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};