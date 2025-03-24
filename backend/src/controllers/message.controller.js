import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import Conversation from "../models/conversation.model.js";
import { getReceiverSocketId, getSenderSocketId, io } from "../lib/socket.js";
import cloudinary from "../lib/cloudinary.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({ _id: {$ne: loggedInUserId} }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error in getUserForSidebar: ", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;

    const conversation = await Conversation.findOne({
      users: { $all: [senderId, userToChatId] }
    });

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const messages = await Message.find({
      conversationId: conversation._id
    }).sort({ createdAt: 1 });

    res.status(200).json({
      conversation,
      messages,
    });
  } catch (error) {
    console.log("Error in getMessages: ", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let conversation = await Conversation.findOne({
      users: { $all: [senderId, receiverId] }
    });

    if (!conversation) {
      conversation = await Conversation.create({
        users: [senderId, receiverId],
      });
    }

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
      conversationId: conversation._id,
      seenBy: [senderId]
    });

    await newMessage.save();

    conversation.messages.push(newMessage._id);
    if (imageUrl) {
      conversation.images.push(imageUrl);
    }
    conversation.lastMessage = {
      text: newMessage.text,
      timestamp: newMessage.timestamp,
      senderId: newMessage.senderId
    };
    await conversation.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    const senderSocketId = getSenderSocketId(senderId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
      io.to(receiverSocketId).emit("newMessageReceived", newMessage);
    }
    if (senderSocketId) {
      io.to(senderSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage: ", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


export const getLastMessage = async (req, res) => {
  try {
    const { user1, user2 } = req.query;

    const lastMessage = await Message.findOne({
      $or: [
        { senderId: user1, receiverId: user2 },
        { senderId: user2, receiverId: user1 }
      ]
    }).sort({ createdAt: -1 });

    return res.status(200).json(lastMessage);
  } catch (error) {
    console.error('Error in getConversation: ', error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const markMessageAsSeen = async (req, res) => {
  try {
    const { messageId, receiverId, senderId } = req.body;
    const message = await Message.findByIdAndUpdate(
      messageId,
      { $addToSet: { seenBy: receiverId } },
      { new: true }
    );

    const receiverSocketId = getReceiverSocketId(receiverId);
    const senderSocketId = getSenderSocketId(senderId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("messageSeen", message);
    }
    if (senderSocketId) {
      io.to(senderSocketId).emit("messageSeen", message);
    }

    return res.status(200).json(message);
  } catch (error) {
    console.error('Error in markMessageAsSeen: ', error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getConversationDetails = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const conversation = await Conversation.findById(conversationId)
      .populate("messages");

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    res.status(200).json(conversation);
  } catch (error) {
    console.log("Error in getConversationDetails: ", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};