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

    const messages = await Message.find({
      $or:[
        { senderId: senderId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: senderId }
      ]
    });

    res.status(200).json(messages);
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
      users: {
        $all: [senderId, receiverId]
      }
    });

    if (!conversation) {
      conversation = await Conversation.create({
        users: [senderId, receiverId],
      });
    }

    let imageUrl;
    if (image) {
      const uploadReponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadReponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
      conversationId: conversation._id,
    });

    await newMessage.save();

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

export const getConversation = async (req, res) => {
  try {
    const { user1, user2 } = req.query;

    const conversations = await Conversation.findOne({ users: { $all: [user1, user2]} });

    return res.status(200).json(conversations);
  } catch (error) {
    console.error('Error in getConversation: ', error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};