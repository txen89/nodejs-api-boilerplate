const jwt = require("jsonwebtoken");
const errorHandlers = require("../utils/errorHandlers");

module.exports = (req, res, next) => {
  const token = req.headers["access-token"];
  if (!token) {
    errorHandlers.mainErrorHandler("Not Authorized", 401);
  }
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.TOKEN_ENC);
  } catch (err) {
    errorHandlers.mainErrorHandler("Not Authorized", 401);
  }

  if (!decodedToken) {
    errorHandlers.mainErrorHandler("Not Authorized", 401);
  }
  req.userId = decodedToken._id;
  next();
};
