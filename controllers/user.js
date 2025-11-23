import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import validator from "validator";
import crypto from "crypto";
import nodemailer from "nodemailer";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};
// Register user
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }
    // Pass Length
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name: name,
      email: email,
      password: hashPass,
      cart: {},
    });

    const user = await newUser.save();
    const token = createToken(user._id);
    res
      .status(201)
      .json({ success: true, message: "User registered", token: token });
    // res.status(201).json({ success: true, message: "User registered" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }
    const token = createToken(user._id);
    res
      .status(200)
      .json({ success: true, message: "Login successful", token: token });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const forgotPassword = async (req, res) => {
  const furl = "https://e-food-beta.vercel.app";
  const { email } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({
        success: true,
        message: "If email exists, reset link sent",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000;
    await user.save();

    const resetLink = `${furl}/reset-password/${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      to: user.email,
      subject: "Password Reset",
      text: `Click here to reset your password: ${resetLink}`,
    });

    res.json({ success: true, message: "Password reset link sent" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const user = await userModel.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.json({ success: true, message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export { loginUser, registerUser, resetPassword, forgotPassword };
