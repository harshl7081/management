const { Router } = require("express");
const { body } = require("express-validator");
// const { inputErrorHandler } = require("./Module/middleware");
const {
  getAllUser,
  getOneUser,
  createUser,
  updateUser,
  deleteUser,
  signIn,
} = require("./Handlers/User");


const router = Router();
// Get All the Users
router.get("/userall", getAllUser);

// Get User by it's id
router.get("/user/:id", getOneUser);

// Create User
router.post(
  "/user",
  [
    body("name").exists(),
    body("username").exists(),
    body("email").optional(),
    body("password").exists(),
  ],
  // inputErrorHandler,
  createUser
);

// Update User
router.put(
  "/user/:id",
  [
    body("name").optional(),
    body("username").optional(),
    body("email").optional(),
    body("password").optional(),
  ],
  // inputErrorHandler,
  updateUser
);

// Delete User
router.delete("/user/:id", deleteUser);

// signin user
router.post(
  "/signin",
  [body("username").exists(), body("password").exists()],
  // inputErrorHandler,
  signIn
);

module.exports = router;