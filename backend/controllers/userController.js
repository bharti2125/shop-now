const { USER } = require("../models/userschema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

let token = "";

const signup = async (req, res) => {
  try {
    const { username, email, password, contact  } = req.body;

    if (!username || !email || !password || !contact )
      return res
        .status(401)
        .json({ message: "fill all the fields", status: 401, success: false });

    const setValue = 10;
    const encryptedPassword = await bcrypt.hash(password, setValue);

    const user = new USER({
      username,
      email,
      contact,
      password: encryptedPassword,
    });

    await user.save();

    const token = await jwt.sign(
      { username, email, contact },
      process.env.SECRET_KEY,
      {
        expiresIn: "1hr",
      }
    );

    // res.send(token)

    return res.status(201).json({
      message: "user registred successfully",
      status: 200,
      success: true,
      token,
        user: { username, email, contact }
    });
  } catch (err) {
    console.log("signup error:", err);
    return res
      .status(500)
      .json({ message: "Internal server error", status: 500, success: false });
  }
};

const getAllUsers = async (req, res) => {
  const users = await USER.find();
  if (!users)
    return res.status(404).json({
      message: " not user registered yet!!",
      success: false,
      status: 404,
    });
  return res.status(200).json({
    message: "user found successfully",
    success: true,
    status: 200,
    users,
  });
};

const getUser = async (req, res) => {
  const { email } = req.query;
  const user = await USER.findOne({ email });
  if (!user)
    return res
      .status(404)
      .json({ message: "user not found", status: 404, success: false });

  return res
    .status(200)
    .json({ message: "Users found", status: 200, success: true, user });
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // const token = req.headers.authorization.split("")[1];
    if (!email || !password)
      return res
        .status(200)
        .json({ message: "fill all the fields", status: 400, success: false });

    const user = await USER.findOne({ email });
    if (!user)
      return res
        .status(200)
        .json({ message: "user not found", status: 404, success: false });

    const isMatched = await bcrypt.compare(password, user.password);

    if (!isMatched)
      return res
        .status(200)
        .json({ message: "incorrect password", status: 401, success: false });

    // Check if token is present in header
    let accessToken = null;
    if (req.headers.authorization?.startsWith("Bearer ")) {
      accessToken = req.headers.authorization.split(" ")[1];
    }

    let isVerified = false;

    if (accessToken) {
      try {
        jwt.verify(accessToken, process.env.SECRET_KEY);
        isVerified = true;
      } catch (err) {
        // Token is invalid or expired — issue a new refresh token
        const refreshToken = jwt.sign(
          { email: user.email, username: user.username },
          process.env.SECRET_KEY,
          { expiresIn: "1hr" }
        );

        res.send(refreshToken);
      }
    }
    return res.status(200).json({
      message: "Login Successful",
      status: 200,
      success: true,
      user,
      token,
      isVerified,
    });
  } catch (err) {
    console.error("Login Error:", err);
    return res
      .status(500)
      .json({ message: "Server error", status: 500, success: false });
  }
};

const updateUserData = async (req, res) => {
  const { email } = req.query;
  const { password } = req.body;
  // const user = await USER.findOneAndUpdate({ email }, { $set: { password: password } })
  const user = await USER.findOne({ email });

  if (!user)
    return res
      .status(404)
      .json({ message: "user not found", status: 404, success: false });

  user.password = password;

  await user.save();

  return res.status(200).json({
    message: "data updated successfully",
    status: 200,
    success: true,
    user,
  });
};

const deleteUser = async (req, res) => {
  const { email } = req.query;

  await USER.findOneAndDelete({ email });

  return res.status(200).json({
    message: "user deleted successfully!!",
    status: 200,
    success: true,
  });
};

module.exports = {
  signup,
  getAllUsers,
  getUser,
  updateUserData,
  deleteUser,
  login,
};
