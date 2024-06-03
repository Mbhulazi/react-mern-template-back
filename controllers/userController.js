const asyncHandler = require("express-async-handler");
const User = require("../models/userModels");
const { getNameFromEmail, generateToken } = require("../utils");
const { welcomeEmail } = require("../emailTemplates/welcomeTemplate");
const sendEmail = require("../utils/sendEmail");
const jwt = require("jsonwebtoken");

const loginWithGoogle = asyncHandler(async (req, res) => {
  const { name, email, sub } = req.user;
  const password = Date.now() + sub;

  // check if usr exists
  const user = await User.findOne({ email });

  if (!user) {
    // create the new user
    const newUser = await User.create({
      name: name ? name : getNameFromEmail(email),
      email,
      password,
    });

    if (newUser) {
      //generate token 
      const token = generateToken(newUser._id);

      // send http=only cookie
      res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 1000,
        sameSite: "none",
        secure: process.env.SECURE,
      });

      const { _id, name, email, phone, role } = newUser;

      // send welcome email to the user
      const subject = "Welcome to SK Mern Template";
      const send_to = email;
      const template = welcomeEmail(name);
      const reply_to = "tinyiko430@gmail.com";

      await sendEmail(subject, send_to, template, reply_to);

      res.status(201).json({
        _id,
        name,
        email,
        phone,
        role,
        message: "login successful",
      });
    }
  }

  // existing users
  if (user) {
    const token = generateToken(user._id);
    
    // send http=only cookie
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 1000,
      sameSite: "none",
      secure: process.env.SECURE,
    });

    const { _id, name, email, phone, role } = user;

    res.status(201).json({
      _id,
      name,
      email,
      phone,
      role,
      message: "login successful",
    });
  }
});

// logout user
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    // maxAge: 30 * 24 * 60 * 1000,
    expires: new Date(0),
    sameSite: "none",
    secure: process.env.SECURE,
  });

  return res.status(200).json({ message: "Logout successful" });
});

// check user login status
const loginStatus = asyncHandler(async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.json(false);
  }
  // verify token
  const verified = jwt.verify(token, process.env.JWT_SECRET);
  if (verified) {
    return res.json(true);
  }
  return res.json(false);
});

// get user
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error("Oops, user not found...");
  }
});

// get users
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort("-createdAt").select("-password");
  if (!users) {
    res.status(500);
    throw new Error("Oops, user not found...");
  }
  res.status(200).json(users);
});

// update user
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  
  if (user) {
    const { name, email, phone } = user;
    
    user.email = email;
    user.name = req.body.name || name;
    user.phone = req.body.phone || phone;

    const updatedUser = await user.save();
   
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      role: updatedUser.role,
      photo: updatedUser.photo,
    });
  } else {
    res.status(404);
    throw new Error("Oops, user not found...");
  }
});

// update user Photo
const updatePhoto = asyncHandler(async (req, res) => {
  const { photo } = req.body;
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("Oops, user not found...");
  }

  user.photo = photo;
  const updatedUser = await user.save();

  res.status(200).json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    phone: updatedUser.phone,
    role: updatedUser.role,
    photo: updatedUser.photo,
  });
});

// delete user
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = User.findById(id);

  if (!user) {
    res.status(404);
    throw new Error("Oops, user not found...");
  }

  await User.findByIdAndDelete(id);

  res.status(200).json({
    message: "User succesfully deleted"
  });
});

// change user role
const changeUserRole = asyncHandler(async (req, res) => {
  const { name, role, id } = req.body;
  
  const user = await User.findById(id);

  if (!user) {
    res.status(404);
    throw new Error("Oops, user not found...");
  }

  user.role = role;
  await user.save();

  res.status(200).json({
    message: `${name}"'"s role has been succesfully updated to ${role}`
  });
});

module.exports = {
  loginWithGoogle,
  logoutUser,
  loginStatus,
  getUser,
  getUsers,
  updateUser,
  updatePhoto,
  deleteUser,
  changeUserRole
};
