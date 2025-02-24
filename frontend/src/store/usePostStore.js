import { create } from 'zustand'
import { axiosInstance } from '../lib/axios.js';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';

export const usePostsStore = create((set, get) => ({
  posts: [],
  arePostsLoading: false,

  getAllPosts: async () => {
    set({ arePostsLoading: true });
    try {
      const res = await axiosInstance.get("/posts/all");
      set({ posts: res.data });
    } catch (error) {
      console.log("Error in getAllPosts", error);
    } finally {
      set({ arePostsLoading: false });
    }
  },

  getUserPosts: async (userId) => {
    set({ arePostsLoading: true });
    try {
      const res = await axiosInstance.get(`/posts/user/${userId}`);
      set({ posts: res.data });
    } catch (error) {
      console.log("Error in getUserPosts", error);
    } finally {
      set({ arePostsLoading: false });
    }
  },

  addReactionToPost: async(postId, userId, reactionType) => {
    const { posts } = get();
    try {
      const res = await axiosInstance.put(`/posts/addReaction/${postId}`, {
        userId: userId,
        reactionType: reactionType,
      });
      set({ posts: posts.map(post => post._id === res.data._id ? res.data : post) });
      toast.success("Reaction has been added");
    } catch (error) {
      console.log("Error in addReactionToPost", error);
    }
  },

  deleteReactionFromPost: async(postId, userId) => {
    const { posts } = get();
    try {
      const res = await axiosInstance.put(`/posts/deleteReaction/${postId}`, {
        userId: userId,
      });
      set({ posts: posts.map(post => post._id === res.data._id ? res.data : post) });
      toast.success("Reaction has been deleted");
    } catch (error) {
      console.log("Error in addReactionToPost", error);
    }
  },

  addCommentToPost: async (postId, text, userId) => {
    const { posts } = get();
    try {
      const res = await axiosInstance.put(`/posts/addComment/${postId}`, {
        userId: userId,
        text: text,
      });
      set({ posts: posts.map(post => post._id === res.data._id ? res.data : post) });
      toast.success("Comment has been added");
    } catch (error) {
      console.log("Error in addCommentToPost", error)
    }
  },

  getPost: async (postId) => {
    try {
      const res = await axiosInstance.get(`/posts/post/${postId}`);
      return res.data;
    } catch (error) {
      console.log("Error in getPost", error)
    }
  },

}));