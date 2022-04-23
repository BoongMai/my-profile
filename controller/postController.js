require("dotenv").config();

// Call models DB
const Post = require("../models/Post");
const User = require("../models/User");

class PostController {
  // @router GET api/posts
  // @desc Read post
  // @access Private
  async getAllPost(req, res) {
    try {
      const posts = await Post.find({ user: req.userId }).populate("user", [
        "username",
      ]);
      res.json({ success: true, data: posts });
    } catch (err) {
      res.status(502).json({
        success: false,
        message: "Hình như server có gì đó sai sai :<<<",
      });
    }
  }

  // @router POST api/posts
  // @desc Create post
  // @access Private
  async createPost(req, res) {
    const { title, description, url, status } = req.body;
    // simple checked
    if (!title)
      return res
        .status(502)
        .json({ success: false, message: "Hình như chưa nhập title rồi :<<<" });

    try {
      const newPost = new Post({
        user: req.userId,
        title,
        description,
        url: url.startsWith("https://") ? url : `https://${url}`,
        status: status || "To learn",
      });

      await newPost.save();

      res.status(200).json({
        success: true,
        message: "Bạn vừa tạo thành công rồi đấy !!!",
        post: newPost,
      });
    } catch (err) {
      res.status(502).json({
        success: false,
        message: "Hình như server có gì đó sai sai :<<<",
      });
    }
  }

  // @router PUT api/posts
  // @desc Update post
  // @access Private

  async updatePost(req, res) {
    const { title, description, url, status } = req.body;
    // simple checked
    if (!title)
      return res
        .status(502)
        .json({ success: false, message: "Hình như chưa nhập title rồi :<<<" });

    try {
      let updatedPost = {
        title,
        description,
        url: url.startsWith("https://") ? url : `https://${url}`,
        status: status || "To learn",
      };

      const postUpdateCondition = { _id: req.params.id, user: req.userId };
      updatedPost = await Post.findOneAndUpdate(
        postUpdateCondition,
        updatedPost,
        { new: true }
      );
      // User not authorised to update post or post not found
      if (!updatedPost)
        return res
          .status(401)
          .json({ success: false, message: " Post not found" });
      res.json({ success: true, message: "Tuyệt vời!", post: updatedPost });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Hình như server có gì đó sai sai :<<<",
      });
    }
  }

  // @router PUT api/posts
  // @desc Update post
  // @access Private

  async datelePost(req, res) {
    try {
      const deleteUpdateCondition = { _id: req.params.id, user: req.userId };
      const deletedPost = await Post.findByIdAndDelete(deleteUpdateCondition);

      if (!deletedPost)
        return res
          .status(401)
          .json({
            success: false,
            message:
              "Không có bài này hoặc người dùng không được xác thực rồi !!! ",
          });
      res.json({ success: true, message: "Tuyệt vời! Bạn vừa xóa bài post đó rồi", post: deletedPost });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Hình như server có gì đó sai sai :<<<",
      });
    }
  }
}

module.exports = new PostController();
