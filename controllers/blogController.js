const Blog = require("../models/blogs");
const User = require("../models/users");
const path = require("path");
const fs = require("fs");
exports.createBlog = async (req, res) => {
  const { title, description } = req.body;
  const userId = req.user.id;
  const images = req.files
    ? req.files.map((file) => ({ imageUrl: file.path.replace(/\\/g, "/") }))
    : [];
  try {
    const name = await User.findById(userId).select("name");
    const blog = await Blog.create({
      title,
      description,
      userId,
      userName: name.name,
      Images: images,
      likes: [],
    });

    res.status(201).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.getSpecificBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.bid);
    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
   
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
exports.allBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.status(200).json({
      success: true,
      data: blogs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
exports.getUserBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ userId: req.user.id });
    res.status(200).json({
      success: true,
      data: blogs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.deleBlogs = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (blog.Images && blog.Images.length > 0) {
      blog.Images.forEach((image) => {
        const filePath = path.join(__dirname, "..", image.imageUrl);
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error("Failed to delete image:", filePath, err);
          }
        });
      });
    }
    await blog.deleteOne();
    res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
exports.likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.bid);
    const userId = req.params.uid;
    const alreadyLiked = blog.likes.some(
      (like) => like.user.toString() === userId.toString()
    );

    if (alreadyLiked) {
      blog.likes = blog.likes.filter(
        (like) => like.user.toString() !== userId.toString()
      );
    } else {
      blog.likes.push({ user: userId });
    }
    await blog.save();
    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
exports.getBlogByKey = async (req, res) => {
  try {

    const blog = await Blog.find({
  $or: [
    { userName: { $regex: req.params.key, $options: "i" } },
    { title: { $regex: req.params.key, $options: "i" } },
    { description: { $regex: req.params.key, $options: "i" } }
  ]
});
    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}
exports.updateBlogs = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    blog.title = req.body.title || blog.title;
    blog.description = req.body.description || blog.description;
    await blog.save();
    res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      data: blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
