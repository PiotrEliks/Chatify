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
  friendRequest: null,

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

  sendFriendRequest: async (userToAddId, userId) => {
    set({ isFriendBeingAdded: true });
    try {
      const res = await axiosInstance.post("/user/friend-request", {
        fromUserId: userId,
        toUserId: userToAddId
      });
      toast.success("Invitation sent");
      set({ friendRequest: res.data.friendRequest });
    } catch (error) {
      console.log("Error in sendFriendRequest", error);
    } finally {
      set({ isFriendBeingAdded: false });
    }
  },

  acceptFriendRequest: async (friendRequestId) => {
    set({ isFriendBeingAdded: true });
    try {
      const res = await axiosInstance.post(`/user/friend-request/${friendRequestId}/accept`);
      toast.success("Invitation accepted");
      set({ friendRequest: res.data.friendRequest });
      console.log(res.data.friendRequest)
    } catch (error) {
      console.log("Error in acceptFriendRequest", error);
    } finally {
      set({ isFriendBeingAdded: false });
    }
  },

  rejectFriendRequest: async (friendRequestId) => {
    set({ isFriendBeingAdded: true });
    try {
      const res = await axiosInstance.post(`/user/friend-request/${friendRequestId}/reject`);
      toast.success("Invitation rejected");
      set({ friendRequest: res.data.friendRequest });
      console.log(res.data.friendRequest)
    } catch (error) {
      console.log("Error in rejectFriendRequest", error);
    } finally {
      set({ isFriendBeingAdded: false });
    }
  },

  getFriendRequestStatus: async (profileUserId, currentUserId) => {
    try {
      const res = await axiosInstance.get("/user/friend-request/status", {params: {
        user1: profileUserId,
        user2: currentUserId
      }});
      set({ friendRequest: res.data.friendRequest });
    } catch (error) {
      console.log("Error in getFriendRequestStatus", error);
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