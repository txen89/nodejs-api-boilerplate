const User = require("../models/userModel");
const { body } = require("express-validator/check");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {
  validationErrorHandler,
  errorHandler
} = require("../utils/errorHandlers");

exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      errorHandler.mainErrorHandler("Email doesn't exist", 404);
    }
    const passwordsMatch = await bcrypt.compare(password, user.password);
    if (!passwordsMatch) {
      throw new Error("Invalid email or password");
      return;
    } else {
      let returnUser = user._doc;
      delete returnUser.password;
      const token = jwt.sign(
        {
          ...returnUser
        },
        process.env.TOKEN_ENC,
        { expiresIn: "24h" }
      );
      res.status(200).json({
        sucess: true,
        message: "Success",
        info: { token: token, user: returnUser }
      });
    }
  } catch (err) {
    return next(err);
  }
};

exports.createUser = (req, res, next) => {
  req
    .getValidationResult()
    .then(validationErrorHandler())
    .then(() => {
      const { password } = req.body;
      return bcrypt.hash(password, 12);
    })
    .then(hashedPassword => {
      const { email, first_name, last_name, username } = req.body;
      const user = new User({
        email,
        first_name,
        last_name,
        username,
        password: hashedPassword
      });
      user.save().then(user => {
        let returnUser = user._doc;
        delete returnUser.password;
        res.status(201).json({
          sucess: true,
          message: "User Created",
          info: returnUser
        });
      });
    })
    .catch(err => {
      return next(err);
    });
};

exports.validateUser = method => {
  switch (method) {
    case "createUser": {
      return [
        body("email")
          .exists()
          .isEmail()
          .normalizeEmail()
          .withMessage("Please enter valid email")
          .custom((value, { req }) => {
            return User.findOne({ email: value }).then(user => {
              if (user) {
                return Promise.reject("Email already exists");
              }
              return true;
            });
          }),
        body("first_name", "Invalid first name")
          .not()
          .isEmpty()
          .exists()
          .isString(),
        body("last_name", "Invalid last name")
          .not()
          .isEmpty()
          .exists()
          .isString(),
        body("username", "Invalid username")
          .not()
          .isEmpty()
          .exists()
          .isString(),
        body("password", "Invalid password")
          .exists()
          .isLength({ min: 5 }),
        body("confirm_password").custom((value, { req }) => {
          if (value !== req.body.password) {
            return Promise.reject(
              "Password confirmation does not match password"
            );
          }
          return true;
        })
      ];
    }
  }
};
