const express = require("express");
const app = express();
const fs = require("fs");
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
const routes = require("./routes");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const path = require("path");
const cors = require("cors");
const dbConnect = require("./utils/dbConnect");
const expressValidator = require("express-validator");
const errorMiddleware = require("./middlewares/errorMiddleware");

var port = process.env.PORT || 5000;

const createLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);
app.use(morgan("combined", { stream: createLogStream }));
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(expressValidator());
app.use(bodyParser.json());
app.use(routes);
app.use(errorMiddleware);

dbConnect()
  .then(result => {
    app.listen(port, () => {
      console.log(`Server up, listening to localhost:${port}, ${result}`);
    });
  })
  .catch(err => console.log(err));
