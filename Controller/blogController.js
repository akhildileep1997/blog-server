const Blog = require("../Models/blogModel");
const User = require("../Models/userSchema");

//logic for adding the blog
const addBlogController = async (req, res) => {
  try {
    console.log('inside add blog api');
    const { title, description, user } = req.body;
    console.log('inside image api 1');
    // const image = req.uploadedFileName;
     console.log("inside image api ");
    // console.log(image);
    if (!title || !description  ||!user) {
      return res.status(400).send({
        success: false,
        message: "nothing received in the body",
      });
    }
    const existingUser = await User.findById(user);
    if (!existingUser) {
      return res.status(400).send({
        success: false,
        message: "unable to locate user",
      });
    }
    const newBlog = new Blog({
      title,
      description,
      image: req.file.filename,
      user:user
    });
    existingUser.blogs.push(newBlog);
    await newBlog.save();
    await existingUser.save();
    console.log(newBlog);
    console.log(existingUser);
    return res.status(200).send({
      success: true,
      message: "New blog added successfully",
      blog: newBlog,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "internal server error",
      error: error.message,
    });
  }
};

//logic for getting all blogs
const getAllBlogsController = async (req, res) => {
  try {
    const blog = await Blog.find({}).populate('user');
    if (!blog) {
      return res.status(200).send({
        success: true,
        message: "no blogs available",
      });
    } else {
      return res.status(200).send({
        success: true,
        message: "all blogs fetched successfully",
        blogs: blog,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "internal server error",
      error: error.message,
    });
  }
};

//logic for updating the blog
const updateBlogController = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const image = req.file ? req.file.filename : undefined; 
    const blog = await Blog.findById(id);
    if (!blog) {
      return res
        .status(404)
        .send({ success: false, message: "Blog not found" });
    }
    blog.title = title;
    blog.description = description;
    if (image) {
      blog.image = image;
    }
    const updatedBlog = await blog.save();
    return res.status(200).send({
      success: true,
      message: "Blog updated successfully",
      blog: updatedBlog,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};



// logic for getting the single blog with particular id
const getABlogWithIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    console.log(blog);
    if (!blog) {
      return res.status(400).send({
        success: false,
        message: "unable to get the blog",
      });
    } else {
      return res.status(200).send({
        success: true,
        message: `blog with ${id} fetched successfully`,
        blog: blog,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "internal server error",
      error: error.message,
    });
  }
};

//logic for getting the blogs added by a particular user
const getAllBlogsAddedByAUserController = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const blogs = await User.find({ _id:id }).populate("blogs");
    console.log(blogs);
    return res.status(200).send({
      success: true,
      message: `all blogs added by ${id} has been fetched successfully`,
      blogs: blogs,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

//logic for deleting the blog by id
const deleteBlogController = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBlog = await Blog.findByIdAndDelete(id).populate("user");
    if (!deletedBlog) {
      return res.status(404).send({
        success: false,
        message: `Blog with id ${id} not found`,
      });
    }
    const user = deletedBlog.user;
    user.blogs.pull(deletedBlog._id);
    await user.save();
    const remainingBlogs = await Blog.find({})

    return res.status(200).send({
      success: true,
      message: `Blog with ${id} deleted successfully`,
      blogs:remainingBlogs
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};



module.exports = {
  getAllBlogsController,
  addBlogController,
  updateBlogController,
  getABlogWithIdController,
  getAllBlogsAddedByAUserController,
  deleteBlogController,
};
