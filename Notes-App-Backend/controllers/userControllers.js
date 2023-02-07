const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const emailInput = asyncHandler(async (req, res) => {
  try {
    // Find user by email
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({ error: "User not found" });

    // Generate a token for reset password
    const resetToken = jwt.sign(
      { _id: user._id },
      process.env.JWT_RESET_PASSWORD,
      { expiresIn: "10m" }
    );

    // Save reset token and expiry time to the user
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 10000; // 10 minutes
    await user.save();

    // Send email to the user with reset password link
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: "Reset Password",
      html: `
        <p>You requested for a password reset</p>
        <p>Click this <a href="http://localhost:3000/reset-password/${resetToken}">link</a> to reset your password</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.json({
      message: "Check your email for the reset password link",
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server error");
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const resetToken = req.params.resetToken;

  try {
    // Verify reset token
    const decoded = jwt.verify(resetToken, process.env.JWT_RESET_PASSWORD);
    if (!decoded) {
      return res.status(400).json({ msg: "No decoded" });
    }

    // Check if user exists
    let user = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ msg: "Invalid reset token" });
    }
    // Hash password
    user.password = password;
    // const salt = await bcrypt.genSalt(10);
    // user.password = await bcrypt.hash(password, salt);

    // Save user
    await user.save();

    // Return success message
    res.json({ msg: "Password reset successful" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Register
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // checking if user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400).send({ message: "User already Exists" });
    throw new Error("User already Exists");
  }

  // adding entry in collection
  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } else {
    res.status(400).send({ message: "Please try again" });
    throw new Error("Error Occured ");
  }
});

// Login
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    user.lastLogin = new Date();
    await user.save();
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      lastLogin: user.lastLogin,
      lastLogout: user.lastLogout,
    });
  } else {
    res.status(400).send({ message: "Invalid Email or Password" });
    throw new Error("Invalid Email or Password");
  }
});

const createNewUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // checking if user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400).send({ message: "User already Exists" });
    throw new Error("User already Exists");
  }

  if (!name || !email || !password || !role) {
    res.status(400).send({ message: "Please fill all the Fields" });
    throw new Error("Please fill all the Fields");
  } else {
    const user = new User({
      name,
      email,
      password,
      role,
    });

    const createdUser = await user.save();

    res.status(201).json(createdUser);
  }
});

const getAllUsers = async (req, res) => {
  const users = await User.find();
  if (!users) return res.status(204).json({ message: "No users found" });
  res.json(users);
};

// const updateUser = async (req, res) => {
//   if (!req?.body?.id) {
//     return res.status(400).json({ message: "ID parameter is required." });
//   }

//   const user = await User.findOne({ _id: req.body.id }).exec();
//   if (!user) {
//     return res
//       .status(204)
//       .json({ message: `No user matches ID ${req.body.id}.` });
//   }
//   if (req.body?.username) user.username = req.body.username;
//   if (req.body?.email) user.email = req.body.email;
//   const result = await user.save();
//   res.json(result);
// };

const updateUser = asyncHandler(async (req, res) => {
  // user will provide this
  const { name, email, role } = req.body;

  const user = await User.findById(req.params.userId);

  if (user) {
    // updating note
    user.name = name;
    user.email = email;
    user.role = role;

    const updatedUser = await user.save();
    res.json(updatedUser);
  } else {
    res.status(404).send({ message: "User not found" });
    throw new Error("User not found");
  }
});

// const deleteUser = async (req, res) => {
//   if (!req?.params?.id)
//     return res.status(400).json({ message: "User ID required" });
//   const user = await User.findByIdAndDelete(req.params.id).exec();
//   if (!user) {
//     return res
//       .status(204)
//       .json({ message: `User ID ${req.params.id} not found` });
//   }
// };

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId);

  if (user) {
    await user.remove();
    res.json({ message: "User Removed" });
  } else {
    res.status(404).send({ message: "User not found" });
    throw new Error("User not found");
  }
});

const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId);

  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

const logoutUser = async (req, res) => {
  try {
    const userId = mongoose.Types.ObjectId(req.params.userId);
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    user.lastLogout = Date.now();
    await user.save();
    return res.status(200).json({ message: "Logout Successful" });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Logout Failed" });
  }
};

module.exports = {
  registerUser,
  authUser,
  createNewUser,
  getAllUsers,
  updateUser,
  deleteUser,
  getUser,
  logoutUser,
  resetPassword,
  emailInput,
};
