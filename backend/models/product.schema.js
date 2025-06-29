 const { default: mongoose } = require("mongoose");

 const productSchema = mongoose.Schema({},

  {strict:false,collections: "product"}
 );

 const products =  mongoose.model("products", productSchema);
 module.exports = products
