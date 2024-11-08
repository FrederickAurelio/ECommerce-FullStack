const Product = require("../models/Products");
const { addUrlProducts } = require("./products-controller");

const searchProducts = async (req, res) => {
  try {
    const { keyword } = req.params;
    if (!keyword || typeof (keyword) !== "string")
      throw new Error("Please input a string")

    const regEx = new RegExp(keyword, "i");

    const createSearchQuery = {
      $or: [
        { title: regEx },
        { description: regEx },
        { category: regEx },
        { brand: regEx },
      ]
    }

    const searchResult = await Product.find(createSearchQuery);
    const addedUrlProducts = addUrlProducts(searchResult, req)


    res.status(200).json({
      success: true,
      searchResult: addedUrlProducts
    });

  } catch (error) {
    console.log(error);
    res.ststus(500).json({
      success: false,
      message: error.message
    })
  }
}

module.exports = { searchProducts };