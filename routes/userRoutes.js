const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/login", userController.loginUser);

router.post(
  "/user",
  userController.validateUser("createUser"),
  userController.createUser
);

module.exports = router;
