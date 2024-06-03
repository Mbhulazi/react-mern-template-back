const admin = require("../firebase/config");
const asyncHandler = require("express-async-handler");

const decodeToken = asyncHandler(async (req, res, next) => {
  const { userToken } = req.body;
  try {
    // const decodedToken = (asyncHandler = await admin.auth.verifyIdToken());
    const decodedToken = await admin.auth().verifyIdToken(userToken);

    if (decodedToken) {
      req.user = decodedToken;
      return next();
    }
    return res.json({ message: "Invalid Login Token" });
  } catch (error) {
    return res.json({ message: "Something went wrong. Try again" });
  }
});

module.exports = decodeToken;
