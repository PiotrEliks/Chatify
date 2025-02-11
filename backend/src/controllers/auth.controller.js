import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const names = fullName.split(' ');
    if (names.length < 2) {
      return res.status(400).json({ message: "Please provide both first name and last name" });
    }
    const [firstName, lastName] = names;
    const baseUsername = firstName.slice(0, 3).toLowerCase() + lastName.slice(0, 3).toLowerCase();

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    const regex = new RegExp(`^${baseUsername}(\\d+)?$`, 'i');
    const similarUsers = await User.find({ username: regex });

    let username;
    if (similarUsers.length === 0) {
      username = baseUsername;
    } else {
      let maxNumber = -1;
      similarUsers.forEach(user => {
        if (user.username.toLowerCase() === baseUsername.toLowerCase()) {
          maxNumber = Math.max(maxNumber, 0);
        } else {
          const suffix = user.username.slice(baseUsername.length);
          const num = parseInt(suffix);
          if (!isNaN(num)) {
            maxNumber = Math.max(maxNumber, num);
          }
        }
      });
      username = baseUsername + (maxNumber + 1);
    }

    const userExists = await User.findOne({ email });

    if (userExists) return res.status(400).json({ message: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      username: username,
      email,
      password: hashedPassword
    });

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        email: newUser.email,
        profilePic: newUser.profilePic,
        backgroundPic: newUser.backgroundPic,
      })
    } else {
      return res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const { identifier, password } = req.body;
  try {
    const query = identifier.includes('@') ? { email: identifier } : { username: identifier };

    const user = await User.findOne(query);
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials "});
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials "});
    }

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("token", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;
    if (!profilePic) {
      return res.status(400).json({ message: "Profile pic is required" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);

    const updatedUser = await User.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error in update profile", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const { id: userToFind } = req.params;
    const user = await User.findOne({ _id: userToFind }).select("-password");

    res.status(200).json(user);
  } catch (error) {
    console.log("Error in getProfile: ", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};