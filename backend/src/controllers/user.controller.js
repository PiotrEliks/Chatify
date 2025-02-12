import User from "../models/user.model.js";
import FriendRequest from "../models/friendRequest.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const addFriend = async (req, res) => {
  try {
    const { id: userToAdd } = req.params;
    const userId = req.user._id;
    const user = await User.findOne({ _id: userId }).select("-password");
    const friend = await User.findOne({ _id: userToAdd }).select("-password");
    console.log("User to delete:", userToAdd);
    console.log("Current user ID:", userId);
    user.friends.push(userToAdd);
    await user.save();

    friend.friends.push(userId);
    await friend.save();

    res.status(200).json({ message: "Friend added successfully", user, friend });
  } catch (error) {
    console.log("Error in addFriend", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteFriend = async (req, res) => {
  try {
    const { id: friendId } = req.params;
    const userId = req.user._id;

    await User.findByIdAndUpdate(userId, { $pull: { friends: friendId } });

    await User.findByIdAndUpdate(friendId, { $pull: { friends: userId } });

    return res.status(200).json({ message: 'Znajomy został usunięty pomyślnie.' });
  } catch (error) {
    console.error('Error in deleteFriend: ', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const sendRequest = async (req, res) => {
  try {
    const { fromUserId, toUserId } = req.body;

    const existingRequest = await FriendRequest.findOne({
      $or: [
        { from: fromUserId, to: toUserId },
        { from: toUserId, to: fromUserId }
      ],
      status: 'pending'
    });

    if (existingRequest) {
      return res.status(400).json({ message: "Request has been already sent" });
    }

    const friendRequest = new FriendRequest({
      from: fromUserId,
      to: toUserId,
    });

    await friendRequest.save();

    io.to(toUserId).emit("friend-request-sent", friendRequest);

    res.status(200).json({ message: "Request sent" });
  } catch (error) {
    console.error('Error in sendRequest: ', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const acceptRequest = async (req, res) => {
  try {
    const requestId = req.params.id;

    const friendRequest = await FriendRequest.findById(requestId);
    if (!friendRequest) {
      return res.status(404).json({ message: 'Request not found' });
    }
    if (friendRequest.status !== 'pending') {
      return res.status(400).json({ message: 'Request has been processed' });
    }

    friendRequest.status = "accepted";
    friendRequest.updatedAt = Date.now();
    await friendRequest.save();

    const userFrom = await User.findById(friendRequest.from);
    const userTo = await User.findById(friendRequest.to);

    if (!userFrom.friends.includes(userTo._id)) {
      userFrom.friends.push(userTo._id);
    }
    if (!userTo.friends.includes(userFrom._id)) {
      userTo.friends.push(userFrom._id);
    }
    await userFrom.save();
    await userTo.save();

    io.to(friendRequest.from.toString()).emit("friend-request-accepted", friendRequest);
    io.to(friendRequest.to.toString()).emit("friend-request-accepted", friendRequest);

    await FriendRequest.findByIdAndDelete(requestId);

    return res.status(200).json({ message: "Request accepted" });
  } catch (error) {
    console.error('Error in acceptRequest: ', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const rejectRequest = async (req, res) => {
  try {
    const requestId = req.params.id;

    const friendRequest = await FriendRequest.findById(requestId);
    if (!friendRequest) {
      return res.status(404).json({ message: 'Request not found' });
    }
    if (friendRequest.status !== 'pending') {
      return res.status(400).json({ message: 'Request has been processed' });
    }

    friendRequest.status = "rejected";
    friendRequest.updatedAt = Date.now();
    await friendRequest.save();

    io.to(friendRequest.from.toString()).emit("friend-request-rejected", friendRequest);
    io.to(friendRequest.to.toString()).emit("friend-request-rejected", friendRequest);

    await FriendRequest.findByIdAndDelete(requestId);

    return res.status(200).json({ message: "Request rejected" });
  } catch (error) {
    console.error('Error in rejectRequest: ', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getRequestStatus = async (req, res) => {
  try {
    const { user1, user2 } = req.query;
    console.log(user1, user2);

    const friendRequest = await FriendRequest.findOne({
      $or: [
        { from: user1, to: user2 },
        { from: user2, to: user1 }
      ]
    });

    if (!friendRequest) {
      return res.status(200).json({ friendRequest: null, message: 'No request' });
    }

    return res.status(200).json({ friendRequest });
  } catch (error) {
    console.error('Error in getRequestStatus: ', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};