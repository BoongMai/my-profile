require("dotenv").config();
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

// Call models db
const User = require("../models/User");

class UserController {
  // @router POST api/auth/register
  // @decs Register user
  // @access Public
  async registerUser(req, res) {
    const { username, password } = req.body;

    // simp validation
    if (!username || !password)
      return res.status(400).json({
        success: false,
        message: "Hình như quên nhập tên tài khoảng hay mật khẩu rùi kìa :<<<",
      });

    try {
      // check existing user
      const user = await User.findOne({ username });

      if (user)
        return res.status(400).json({
          success: false,
          message: "Ai đó đã dùng tên tài khoảng này òi !!",
        });

      // All good
      const hashedPassword = await argon2.hash(password);
      const newUser = new User({ username, password: hashedPassword });
      await newUser.save();

      // Return token
      const accessToken = jwt.sign(
        { userId: newUser._id },
        process.env.ACCESS_TOKEN_SECRET
      );
      res
        .status(200)
        .json({ success: true, message: "Tạo được rồi nè :>>>", accessToken });
    } catch (err) {
      res
        .status(500)
        .json({ success: false, message: "Server lỗi rồi bạn ơi :<" });
    }
  }

  // @router POST api/auth/login
  // @decs Login user
  // @access Public
  async loginUser(req, res) {
    const { username, password } = req.body;

    // simp validation
    if (!username || !password)
      return res.status(400).json({
        success: false,
        message:
          "Hình như bạn chưa nhập tài khoảng hoặc mật khẩu rồi óh :<<< !!",
      });

    try {
      // check existing user
      const user = await User.findOne({ username });
      if (!user)
        return res.status(400).json({
          success: false,
          message: "Nhập sai tài khoảng hoặc mật khẩu òi đó :<<< ",
        });

      // User found

      const passwordValid = await argon2.verify(user.password, password);
      if (!passwordValid)
        return res.status(400).json({
          success: false,
          message: "Nhập sai tài khoảng hoặc mật khẩu òi đó :<<< ",
        });
      // All good
      // Return token
      const accessToken = jwt.sign(
        { userId: user._id },
        process.env.ACCESS_TOKEN_SECRET
      );

      res.status(200).json({
        success: true,
        message: "Ý !!! Đang nhập thành công rồi nè ",
        accessToken,
      });

    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Server lỗi rồi bạn ơi :<" });
    }
  }
}

module.exports = new UserController();
