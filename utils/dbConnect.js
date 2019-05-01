const mongoose = require("mongoose");
let dbConnect = () => {
  if (process.env.DB_NAME) {
    return new Promise((resolve, reject) => {
      mongoose.connect(
        `mongodb+srv://${process.env.DB_USERNAME}:${
          process.env.DB_PASS
        }@cluster0-rjpr1.mongodb.net/${process.env.DB_NAME}?retryWrites=true`
      );
      resolve("app connected to db");
    });
  } else {
    return new Promise((resolve, reject) => {
      resolve("app not connected to db");
    });
  }
};
module.exports = dbConnect;
