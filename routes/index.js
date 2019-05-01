const express = require("express");
const router = express.Router();

const productsRoutes = require("./productsRoutes");
const userRoutes = require("./userRoutes");

router.use("/api", productsRoutes, userRoutes);

module.exports = router;
