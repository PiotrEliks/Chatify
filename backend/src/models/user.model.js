import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profilePic: {
      type: String,
      default: "",
    },
    backgroundPic: {
      type: String,
      default: "",
    },
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }
    ],
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      }
    ],
    biogram: {
      type: String,
      default: "",
    },
    relationshipStatus: {
      type: String,
      default: "",
      enum: ['','single', 'married', 'engaged', 'divorced', 'complicated'],
    },
    education: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    work: {
      type: String,
      default: "",
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;