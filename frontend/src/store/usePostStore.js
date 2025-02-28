import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import toast from 'react-hot-toast';

export const usePostsStore = create((set, get) => ({
  allPosts: [],
  userPosts: [],
  arePostsLoading: false,
  isPostCreating: false,

  createPost: async (postData, isUserPage) => {
    set({ isPostCreating: true });
    const { getUserPosts, getFriendsPosts } = get();
    try {
      const res = await axiosInstance.post("/posts/create", postData);
      if (isUserPage) {
        getUserPosts(postData.userId);
      } else {
        getFriendsPosts(postData.userId);
      }
    } catch (error) {
      console.log("Error in createPost", error);
    } finally {
      set({ isPostCreating: false });
    }
  },

  deletePost: async (postId, userId, isUserPage) => {
    set({ arePostsLoading: true });
    const { getUserPosts, getFriendsPosts } = get();
    try {
      const res = await axiosInstance.delete(`/posts/delete/${postId}`);
      if (isUserPage) {
        getUserPosts(userId);
      } else {
        getFriendsPosts(userId);
      }
      toast.success("Post has been deleted")
    } catch (error) {
      console.log("Error in deletePost", error);
    } finally {
      set({ arePostsLoading: false });
    }
  },

  getAllPosts: async () => {
    set({ arePostsLoading: true });
    try {
      const res = await axiosInstance.get("/posts/all");
      set({ allPosts: res.data });
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
      set({ userPosts: res.data });
    } catch (error) {
      console.log("Error in getUserPosts", error);
    } finally {
      set({ arePostsLoading: false });
    }
  },

  getFriendsPosts: async (userId) => {
    set({ arePostsLoading: true });
    try {
      const res = await axiosInstance.get(`/posts/friends/${userId}`);
      set({ allPosts: res.data });
    } catch (error) {
      console.log("Error in getFriendsPosts", error);
    } finally {
      set({ arePostsLoading: false });
    }
  },

  addReactionToPost: async (postId, userId, reactionType, isUserPage) => {
    const { allPosts, userPosts } = get();
    try {
      const res = await axiosInstance.put(`/posts/addReaction/${postId}`, {
        userId,
        reactionType,
      });

      const updatedPosts = (posts) =>
        posts.map((post) => (post._id === res.data._id ? res.data : post));

      if (isUserPage) {
        set({ userPosts: updatedPosts(userPosts) });
      } else {
        set({ allPosts: updatedPosts(allPosts) });
      }

      toast.success("Reaction has been added");
    } catch (error) {
      console.log("Error in addReactionToPost", error);
    }
  },

  deleteReactionFromPost: async(postId, userId, isUserPage) => {
    const { allPosts, userPosts } = get();
    try {
      const res = await axiosInstance.put(`/posts/deleteReaction/${postId}`, {
        userId: userId,
      });
      const updatedPosts = (posts) =>
        posts.map((post) => (post._id === res.data._id ? res.data : post));

      if (isUserPage) {
        set({ userPosts: updatedPosts(userPosts) });
      } else {
        set({ allPosts: updatedPosts(allPosts) });
      }
      toast.success("Reaction has been deleted");
    } catch (error) {
      console.log("Error in addReactionToPost", error);
    }
  },

  addCommentToPost: async (postId, text, userId, isUserPage) => {
    const { allPosts, userPosts } = get();
    try {
      const res = await axiosInstance.put(`/posts/addComment/${postId}`, {
        userId,
        text,
      });

      const updatedPosts = (posts) =>
        posts.map((post) => (post._id === res.data._id ? res.data : post));

      if (isUserPage) {
        set({ userPosts: updatedPosts(userPosts) });
      } else {
        set({ allPosts: updatedPosts(allPosts) });
      }

      toast.success("Comment has been added");
    } catch (error) {
      console.log("Error in addCommentToPost", error);
    }
  },
}));
