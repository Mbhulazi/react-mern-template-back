const asyncHandler = require("express-async-handler");
const User = require("../models/userModels");
const jwt = require("jsonwebtoken");

const protect = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      res.status(401);
      throw new Error("Oops, please login to continue...");
    }

    // verify token
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    // get user id from token
    const user = await User.findById(verified.id).select("-password");

    if (!user) {
      res.status(404);
      throw new Error("Oops, user not found...");
    }

    if (user.role === "suspended") {
      res.status(400);
      throw new Error("UserId suspended, please contact support");
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401);
    throw new Error("Oops, please login to continue...");
  }
});

// admit only admin
const adminOnly = asyncHandler(async (req, res, next) => {
if (req.user && req.user.role === "admin") {
    next()
} else {
    res.status(401);
    throw new Error("Oops, login as administrater to continue...");
}

})
module.exports = { protect, adminOnly };
