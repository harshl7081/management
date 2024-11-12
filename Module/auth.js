/* eslint-disable no-undef */
const { hash, compare } = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const hashPassword = (password) => {
  return hash(password, 10);
};

const comparePassword = (password, hash) => {
  return compare(password, hash);
};

const createJWT = (user) => {
  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      name: user.name,
    },
    process.env.JWT_SECRET
  );
  return token;
};

const protect = (req, res, next) => {
  const bearer = req.headers.authorization;
  console.log("Bearer = " + bearer);
  if (!bearer) {
    res.status(401);
    res.json({ message: "not authorized" });
    return;
  }

  const [, token] = bearer.split(" ");  

  if (!token) {
    res.status(401);
    res.json({ message: "not valid token" });
    return;
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (error) {
    res.status(401);
    res.json({ message: "not valid token", error });
    return;
  }
};

module.exports = { hashPassword, comparePassword, createJWT, protect };
