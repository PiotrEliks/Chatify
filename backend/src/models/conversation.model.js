import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      }
    ],
    name: {
      type: String,
    },
    isGroup: {
      type: Boolean,
      default: false,
    },
    lastMessage: {
      text: {
        type: String
      },
      timestamp: {
        type: Date
      },
      senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
    },
  },
  { timestamps: true }
);

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;