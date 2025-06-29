const Products = require("../models/product.schema.js");

const productController = async (req, res) => {
  const products = await Products.find();

  if (!products)
    return res
      .status(401)
      .json({ message: "product not found", status: 404, success: false });

  return res.status(200).json({
    message: "product found successfully",
    status: 200,
    success: true,
    products,
  });
};

module.exports = productController;
