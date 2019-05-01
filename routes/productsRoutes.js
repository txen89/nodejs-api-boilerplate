const express = require("express");
const router = express.Router();
const isAuth = require("../middlewares/isAuth");
const productsController = require("../controllers/productsController");

router.get("/products", isAuth, productsController.getAllProducts);

router.get("/products/:productId", isAuth, productsController.getSingleProduct);

router.put("/products", isAuth, productsController.updateProduct);

router.post("/products", isAuth, productsController.postProduct);

router.delete("/products/:productId", isAuth, productsController.deleteProduct);

module.exports = router;
