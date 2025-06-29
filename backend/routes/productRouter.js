 const express = require('express');
 const productController = require("../controllers/productController"); 


const productRouter = express.Router();

productRouter.get('/products', productController)



module.exports = productRouter