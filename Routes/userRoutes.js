const express = require("express");
const {
  userRegisterController,
  userLoginController,
  getAllUserDetailsController,
  getUserBlogsSeparatelyController,
} = require("../Controller/userController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

//route for registration
router.post("/register", userRegisterController);

//route for login
router.post("/login", userLoginController);

//route for getting all users
router.get("/all-users", authMiddleware, getAllUserDetailsController);

//rote for getting users blogs separately
router.get("/author/:id", authMiddleware, getUserBlogsSeparatelyController);

module.exports = router;
