const Product = require("../models/productsModel");
const errorHandlers = require("../utils/errorHandlers");

exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ creatorId: req.userId });
    res.status(200).json({
      sucess: true,
      message: "Success",
      info: products
    });
  } catch (err) {
    return next(err);
  }
};

exports.getSingleProduct = async (req, res, next) => {
  const { productId } = req.params;
  try {
    const product = await Product.findOne({
      _id: productId,
      creatorId: req.userId
    });

    if (!product) {
      errorHandlers.mainErrorHandler("Not Authorized", 401);
    }
    res.status(200).json({
      sucess: true,
      message: "Success",
      info: product
    });
  } catch (err) {
    return next(err);
  }
};

exports.updateProduct = async (req, res, next) => {
  const { _id, title, price, description, image_url } = req.body;
  try {
    const product = await Product.findOne({ _id: _id, creatorId: req.userId });

    if (!product) {
      errorHandlers.mainErrorHandler("Not Authorized", 401);
    }
    product.title = title;
    product.price = price;
    product.description = description;
    product.image_url = image_url;
    const savedProduct = await product.save();

    res.status(201).json({
      sucess: true,
      message: "Product Updated",
      info: savedProduct
    });
  } catch (err) {
    return next(err);
  }
};

exports.postProduct = async (req, res, next) => {
  const { title, price, description, image_url } = req.body;

  try {
    const product = new Product({
      title,
      price,
      description,
      image_url,
      creatorId: req.userId
    });
    const savedProduct = await product.save();

    res.status(200).json({
      sucess: true,
      message: "Product Created",
      info: savedProduct
    });
  } catch (err) {
    return next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  const { productId } = req.params;
  try {
    const product = await Product.findOneAndRemove({
      _id: productId,
      creatorId: req.userId
    });
    if (!product) {
      res.status(400).json({
        sucess: false,
        message: "Product Not Found"
      });
    } else {
      res.status(200).json({
        sucess: true,
        message: "Product Deleted"
      });
    }
  } catch (err) {
    return next(err);
  }
};
