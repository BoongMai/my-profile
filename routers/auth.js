const express = require("express");
const router = express.Router();

// Import controller
const UserController = require("../controller/userController");

// @router POST api/auth/register
// @decs Register user
// @access Public
router.post("/register", UserController.registerUser);

// @router POST api/auth/login
// @decs Login user
// @access Public
router.post("/login", UserController.loginUser);

module.exports = router;
