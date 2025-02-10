import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }
    ],
    name: {
      type: String,
    },
    isGroup: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;