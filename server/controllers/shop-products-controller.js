const Product = require("../models/Products");
const { addUrlProducts, addUrlProduct } = require("./products-controller");

const getFilteredProducts = async (req, res) => {
  try {
    const { filter, sortBy } = req.query;
    const { category = [], brand = [] } = filter ? JSON.parse(decodeURIComponent(filter)) : {};

    const query = {};
    const sort = {};

    if (category.length > 0) query.category = { $in: category };
    if (brand.length > 0) query.brand = { $in: brand };

    switch (sortBy) {
      case "title-atoz":
        sort.title = 1;
        break;
      case "title-ztoa":
        sort.title = -1;
        break;
      case "price-lowtohigh":
        sort.price = 1;
        break;
      case "price-hightolow":
        sort.price = -1;
        break;
      default:
        break;
    }

    const products = await Product.find(query).sort(sort);
    const addedUrlProducts = addUrlProducts(products, req);
    res.status(200).json({
      success: true,
      products: addedUrlProducts,
      message: "Success Fetch Data"
    })
  } catch (error) {
    console.log(error)
    res.json({
      success: false,
      message: error?.message
    })
  }
}

const getProductDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    const addedUrlProduct = addUrlProduct(product, req)
    if (!product) throw new Error("Product Not Found");
    return res.status(200).json({
      success: true,
      product: addedUrlProduct,
      message: "Success Fetch Data"
    })
  } catch (error) {
    console.log(error)
    res.json({
      success: false,
      message: error?.message
    })
  }
}

module.exports = { getFilteredProducts, getProductDetails };