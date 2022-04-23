const jwt = require("jsonwebtoken");
require('dotenv').config()

const verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(' ')[1];

  if (!token)
    return res
      .status(401)
      .json({ success: false, message: "Chưa có token rồi bạn ơi :>>>" });

  try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
      req.userId = decoded.userId
      next()
  } catch (err) {
      console.log(err)
      return res.status(403).json({ success: false, message:"Token lệch rồi bạn ơi :<<<"})
  }
};

module.exports = verifyToken