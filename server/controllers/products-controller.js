const Product = require("../models/Products");
const multer = require("multer");
const path = require('path');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../images')); // Adjust path as needed
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname.split(".")[0] + "_" + Date.now() + "." + file.originalname.split(".")[1]);
  }
});

const imgUpload = multer({ storage: storage });

const createProduct = async (req, res) => {
  if (!req?.file) {
    return res.json({
      success: false,
      message: "Please upload an image"
    })
  }

  const imageUrl = `/images/${req?.file?.filename}`
  const { title, description, category, brand, price, salePrice, totalStock } = req.body;

  try {
    if (req.user.role !== "admin") throw new Error("You are not admin")
    const newProduct = new Product({
      title,
      description,
      imageUrl,
      category,
      brand,
      price: Number(price),
      salePrice: Number(salePrice),
      totalStock: Number(totalStock)
    })
    await newProduct.save();
    res.status(201).json({
      success: true,
      message: "Create new product successfull",
      product: newProduct
    })
  } catch (error) {
    console.log(error)
    res.json({
      success: false,
      message: error.message
    })
  }
}

const addUrlProducts = function (listOfProducts, req) {
  return listOfProducts.map(product => {
    product.imageUrl = `${req.protocol}://${req.get("host")}${product.imageUrl}`
    return product
  })
}

const getAllProducts = async (req, res) => {
  try {
    const listOfProducts = await Product.find({});
    const addedUrlProducts = addUrlProducts(listOfProducts, req);
    res.status(201).json({
      success: true,
      message: "Fetch all products successfull",
      products: addedUrlProducts
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    let newImageUrl;

    if (req?.file) {
      newImageUrl = `/images/${req?.file?.filename}`
    }
    const { title, description, category, brand, price, salePrice, totalStock } = req.body;

    const findProduct = await Product.findById(id);
    if (!findProduct) throw new Error("Product not found!")

    findProduct.title = title || findProduct.title;
    findProduct.description = description || findProduct.description;
    findProduct.category = category || findProduct.category;
    findProduct.brand = brand || findProduct.brand;
    findProduct.price = price || findProduct.price;
    findProduct.salePrice = salePrice || findProduct.salePrice;
    findProduct.totalStock = totalStock || findProduct.totalStock;
    findProduct.imageUrl = newImageUrl || findProduct.imageUrl;

    await findProduct.save();
    res.status(200).json({
      success: true,
      message: "Update product successfull",
      product: findProduct
    })

  } catch (error) {
    res.json({
      success: false,
      message: error.message
    })
  }
}

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const findProduct = await Product.findByIdAndDelete(id);
    if (!findProduct) throw new Error("Product not found")

    res.status(200).json({
      success: true,
      message: "Product Deleted"
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

module.exports = { addUrlProducts, createProduct, getAllProducts, editProduct, deleteProduct, imgUpload }