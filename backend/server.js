const express = require("express");
const dotenv = require("dotenv");
const { userRoutes } = require("./routes/userRoutes.js");
const { default: mongoose } = require("mongoose");
// const multer  = require('multer')
// const upload = multer({ dest: 'uploads/' })
const cors = require("cors");
const multerRouter = require("./routes/multer.routes.js");
const productRouter = require("./routes/productRouter.js");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const MONGO_URL = process.env.MONGO_URL;
try {
  mongoose.connect(MONGO_URL);
  console.log("DB IS CONNECTED");
} catch (err) {
  console.log(err);
}

// app.post('/profile', upload.single('image'), function (req, res, next) {
//   res.send(req.file)
//   next()
// })

app.use(express.json());
app.use(cors());
app.use(productRouter);
app.use(multerRouter);
app.use(userRoutes);
app.listen(PORT, () => {
  console.log(`server is running on the Port ${PORT}`);
});
