import { create } from 'zustand'
import { axiosInstance } from '../lib/axios.js';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';

export const usePostsStore = create((set, get) => ({
  posts: null,
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
      const res = await axiosInstance.get(`/posts/${userId}`);
      set({ posts: res.data });
    } catch (error) {
      console.log("Error in getUserPosts", error);
    } finally {
      set({ arePostsLoading: false });
    }
  },

  addReactionToPost: async(postId, userId, reactionType) => {
    try {
      const res = await axiosInstance.put(`/posts/addReaction/${postId}`, {
        userId: userId,
        reactionType: reactionType,
      });
      toast.success("Reaction added");
    } catch (error) {
      console.log("Error in addReactionToPost", error);
    }
  },

}));