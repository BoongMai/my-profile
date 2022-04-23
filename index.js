require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

// Gọi router
const authRouter = require("./routers/auth");
const postRouter = require("./routers/post");

// Setup port
const PORT = "5000";

const connectDB = async () => {
  try {
    // DB localhost
    // await mongoose.connect('mongodb://127.0.0.1:27017/my-profile')

    
    await mongoose.connect(
      `mongodb+srv://BoongMai:${process.env.DB_PASSWORD}@my-profile.pscoa.mongodb.net/my-profile?retryWrites=true&w=majority`
    );
    console.log("Connect Success to DB !!!");
  } catch (err) {
    console.log("err");
    process.exit(1);
  }
};

connectDB();

const app = express();
app.use(express.json());

// Declera link router
app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
app.get("/", (req, res) => res.send("Hello"));

// Declare success runing port
app.listen(PORT, () => console.log(`server start at http://localhost:${PORT}`));
