const express = require("express");
const dotenv = require("dotenv");
const User = require("../models/User");
const RefreshTokens = require("../models/RefreshTokens");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();

// creating a user
router.post("/create-account", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (username && password) {
      let UserDoesExist = await User.findOne({ name: username });
      if (UserDoesExist) {
        return res.json({ status: '400', msg: "User with same name exists, try another one" });
      }
      let hashedPassword = await bcrypt.hash(password, 10);
      await User.create({ name: username, password: hashedPassword }, () => {
        res.status(201).json({ status: '201', msg: "User Created" });
      });
    } else {
      res.status(400).json({ msg: "Enter username & password" });
    }
  } catch (error) {
    console.error(error);
  }
});

// Logout
router.delete("/logout", async (req, res) => {
  const { token } = req.body;
  try {
    await RefreshTokens.findOneAndDelete({ value: token }, (err, response) => {
      res.json({ msg: "logged out" });
    });
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const userObj = { username };
    const accessToken = generateAccessToken(userObj);
    const refreshToken = jwt.sign(userObj, process.env.REFRESH_TOKEN_SECRET);
    // ADD THE REFRESH TOKEN TO THE DATABASE

    if (username && password) {
      let user = await User.findOne({ name: username });
      if (!user) {
        res.sendStatus(404);
      } else {
        const isCorrect = await bcrypt.compare(password, user.password);
        if (isCorrect) {
          res.status(200).json({ accessToken, refreshToken });
        } else {
          res.json({ msg: "Invalid Password" });
        }
      }
    } else {
      res.status(400);
    }
  } catch (error) {
    console.error(error);
  }
});

//IF THE ACCESS TOKEN EXPIRED
router.post("/token", async (req, res) => {
  const refreshToken = req.body.token;
  if (!refreshToken) return res.sendStatus(401);
  let token = await RefreshTokens.findOne({ value: refreshToken });
  if (!token) {
    return res.sendStatus(403);
  }
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) res.sendStatus(403);
    // const name = {name: user.name}
    const userObj = { username: user.name };
    const accessToken = generateAccessToken(userObj);
    res.json({ accessToken });
  });
});

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
}

module.exports = router;
