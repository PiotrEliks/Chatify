import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const reactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ['like', 'heart', 'haha', 'sad'],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
    },
    image: {
      type: String,
    },
    comments: {
     type: [commentSchema],
     default: [],
    },
    reactions: {
      type: [reactionSchema],
      default: [],
     },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;