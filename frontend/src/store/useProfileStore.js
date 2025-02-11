import { create } from 'zustand'
import { axiosInstance } from '../lib/axios.js';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';

export const useProfileStore = create((set, get) => ({
  selectedUser: null,
  setSelectedUser: (selectedUser) => {
    set({ selectedUser })
  },
  isProfileLoading: false,
  userProfile: null,
  isFriendBeingAdded: false,
  isFriendBeingDeleted: false,

  getProfile: async (userId) => {
    set({ isProfileLoading: true });
    try {
      const res = await axiosInstance.get(`/auth/profile/${userId}`);
      set({ userProfile: res.data });
    } catch (error) {
      console.log("Error in getProfile", error);
    } finally {
      set({ isProfileLoading: false });
    }
  },

  addFriend: async (userToAddId, userId) => {
    set({ isFriendBeingAdded: true });
    try {
      const res = await axiosInstance.put(`/user/add/${userToAddId}`, userId);
      toast.success("Friend has been added");
    } catch (error) {
      console.log("Error in addFriend", error);
      toast.error("Error while adding a friend");
    } finally {
      set({ isFriendBeingAdded: false });
    }
  },

  deleteFriend: async (userToDeleteId, userId) => {
    set({ isFriendBeingDeleted: true });
    try {
      const res = await axiosInstance.put(`/user/delete/${userToDeleteId}`, userId);
      toast.success("Friend has been deleted");
    } catch (error) {
      console.log("Error in deleteFreind", error);
      toast.error("Error while deleting a friend");
    } finally {
      set({ isFriendBeingDeleted: false });
    }
  },
}));