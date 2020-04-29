const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/user");
const { JWT_SECRET } = require("../keys");
const authorizeRoute = require("../middleware/authorizeRoute");

const signUpUser = async ({ name, email, password, pic }, res) => {
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: "User already exists." });
    }
    const hashedPassword = await bcrypt.hash(password, 16);
    const user = new User({
      email,
      password: hashedPassword,
      name,
      pic,
    });
    const savedUser = await user.save();
    if (savedUser) {
      res.status(201).json({ message: "User successfully registered" });
    }
  } catch (err) {
    console.log(err);
  }
};

const signInUser = async ({ email, password }, res) => {
  try {
    const userExists = await User.findOne({ email });
    if (!userExists) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    const doPasswordMatch = await bcrypt.compare(password, userExists.password);
    if (doPasswordMatch) {
      const token = jwt.sign({ _id: userExists._id }, JWT_SECRET);
      const { _id, name, email, followers, following, pic } = userExists;
      res
        .status(201)
        .json({ token, user: { _id, name, email, followers, following, pic } });
    } else {
      return res.status(400).json({ error: "Invalid email or password" });
    }
  } catch (err) {
    console.log(err);
  }
};

router.get("/protected", authorizeRoute, (req, res, next) => {
  res.send("hELLO");
});

router.post("/signup", (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Bad Request" });
  }
  signUpUser(req.body, res);
});

router.post("/signin", (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "please add email and password" });
  }
  signInUser(req.body, res);
});

module.exports = router;
