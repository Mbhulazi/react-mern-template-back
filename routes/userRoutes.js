const express = require("express");
const router = express.Router();
const decodeToken = require("../middleware/firebaseMiddleware");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const {
  loginWithGoogle,
  logoutUser,
  loginStatus,
  getUser,
  getUsers,
  updateUser,
  updatePhoto,
  deleteUser,
  changeUserRole,
} = require("../controllers/userController");

router.post("/google/callback", decodeToken, loginWithGoogle);
router.get("/logout", logoutUser);
router.get("/loginStatus", loginStatus);

router.get("/getUser", protect, getUser);
router.get("/getUsers", protect, adminOnly, getUsers);
router.patch("/updateUser", protect, updateUser);

router.patch("/updatePhoto", protect, updatePhoto);
router.delete("/:id", protect, adminOnly, deleteUser);
router.post("/changeUserRole", protect, adminOnly, changeUserRole);

module.exports = router;
