const User = require("../Models/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// logic for registering the user

const userRegisterController = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userCheck = await User.findOne({ email });
    if (userCheck) {
      return res.status(400).send({
        success: true,
        message: "User already exist please login",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      blogs: [],
    });
    await newUser.save();
    console.log(newUser);
    return res.status(201).send({
      success: true,
      message: "New User Registered successfully",
      user: newUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "something went wrong while creating the user",
    });
  }
};
// logic for login
const userLoginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).send({
        success: true,
        message: "User Not Found",
      });
    }
    const PasswordMatch = await bcrypt.compare(password, user.password);
    if (!PasswordMatch) {
      return res.status(200).send({
        success: true,
        message: "Incorrect Password Or Email",
      });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "Logged in successfully",
      user: user,
      token,
    });
    console.log(user, token);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "something went wrong while login",
      success: false,
      error,
    });
  }
};

//logic for getting all user details
const getAllUserDetailsController = async (req, res) => {
  try {
    const users = await User.find({});
    if (users) {
      return res.status(200).send({
        success: true,
        message: "all users fetched successfully",
        users: users,
      });
    } else {
      return res.status(400).send({
        success: false,
        message: "unable to fetch user details",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "something went wrong while fetching all user details",
      success: false,
      error,
    });
  }
};

//user details for getting separate blogs
const getUserBlogsSeparatelyController = async (req, res) => {
  try {
    console.log('inside author details');
    const {id} = req.params
    console.log(id);
    const blogs = await User.findOne({_id:id}).populate('blogs')
    if (blogs) {
      return res.status(200).send({
        success: true,
        message: `blogs of user with id ${id} fetched successfully`,
        blogs:blogs
      })
    } else {
      return res.status(400).send({
        success: false,
        message:'unable to fetch user details'
      })
    }
  } catch (error) {
      console.log(error);
    res.status(500).send({
      message: "something went wrong while fetching all user details",
      success: false,
      error:error.message
    });
  }
}

module.exports = {
  userRegisterController,
  userLoginController,
  getAllUserDetailsController,
  getUserBlogsSeparatelyController
};
