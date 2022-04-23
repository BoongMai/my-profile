const express = require("express");
const router = express.Router();
require('dotenv').config();

// Call Verify Token
const verifyToken = require("../middleware/auth")

// Call Post controller 
const postController = require('../controller/postController')

// @router api/posts
// @desc Create post
// @access Private
router.get("/", verifyToken, postController.getAllPost);
router.post("/", verifyToken, postController.createPost);
router.put("/:id", verifyToken, postController.updatePost);
router.delete("/:id", verifyToken, postController.datelePost);



module.exports = router;