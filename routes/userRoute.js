// Import necessary modules
const express = require("express");

const {
  signup,
  signin,
  logout,
  leaderBoard,
} = require("../controllers/userController");
const { verifyToken } = require("../middlewares/verifyToken");

// Create a new router instance
const userRouter = express.Router();

// Define POST endpoints for user signup, signin, logout and leaderboard
userRouter.route("/signup").post(signup);
userRouter.route("/signin").post(signin);
userRouter.route("/logout").post(verifyToken, logout);
userRouter.route("/leaderboard").get(leaderBoard);

// Export the router instance for use in other modules
module.exports = userRouter;
