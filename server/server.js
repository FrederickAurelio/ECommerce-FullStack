const express = require("express");
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRouter = require("./routes/auth-route");
const productsRouter = require("./routes/products-route");
const shopProductsRouter = require("./routes/shop-products-route");
const cartProductRouter = require("./routes/cart-route");
const addressRouter = require("./routes/address-route");
const orderRouter = require("./routes/order-route");
const adminOrderRouter = require("./routes/admin-order-route");
require('dotenv').config();


mongoose.connect("mongodb://localhost:27017/ECommerce")
  .then(() => console.log("Connected to Database"))
  .catch((err) => console.log((err)))

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma"
    ],
    credentials: true,
  })
)


app.use(cookieParser());
app.use(express.json());

app.use('/images', express.static('images'));
app.use("/api/auth", authRouter);

app.use("/api/admin/products", productsRouter);
app.use("/api/admin/order", adminOrderRouter);

app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/cart", cartProductRouter);
app.use("/api/shop/address", addressRouter);
app.use("/api/shop/order", orderRouter);

app.listen(PORT, () => console.log(`Server is now running on port ${PORT}`))