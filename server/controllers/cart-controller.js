const Cart = require("../models/Cart");
const Product = require("../models/Products");

const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    if (!userId || !productId || quantity <= 0)
      throw new Error("Invalid data provided");

    const product = await Product.findById(productId);
    if (!product)
      throw new Error("Product Not Found");

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] })
    }
    const findCurrentProduct = cart.items.find(item => item.productId.toString() === productId)

    if (!findCurrentProduct) {
      cart.items.push({ productId, quantity })
    } else {
      findCurrentProduct.quantity += quantity;
    }

    await cart.save();
    const populatedCart = await cart.populate({
      path: "items.productId",
      select: "imageUrl title price salePrice"
    })

    const populateCartItems = populatedCart.items.map(item => ({
      productId: item?.productId?._id,
      imageUrl: `${req.protocol}://${req.get("host")}${item.productId.imageUrl}`,
      title: item?.productId?.title,
      price: item?.productId?.price,
      salePrice: item?.productId?.salePrice,
      quantity: item?.quantity,
    }))

    res.status(200).json({
      success: true,
      cart: {
        ...cart._doc,
        items: populateCartItems
      },
      message: "Success Add Item to Cart"
    })
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    })
  }
}

const getCartItems = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId)
      throw new Error("User id is required")

    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "imageUrl title price salePrice"
    })
    if (!cart)
      throw new Error("Cart not found")

    // So if the Product is deleted the productItem will be null and get filtered
    const validItems = cart.items.filter(productItem => productItem.productId);
    if (validItems.length < cart.items.length) {
      cart.items = validItems
      await cart.save()
    }

    const populateCartItems = validItems.map(item => ({
      productId: item.productId._id,
      imageUrl: `${req.protocol}://${req.get("host")}${item.productId.imageUrl}`,
      title: item.productId.title,
      price: item.productId.price,
      salePrice: item.productId.salePrice,
      quantity: item.quantity,
    }))
    res.status(200).json({
      success: true,
      message: "Fetch successfully",
      cart: {
        ...cart._doc,
        items: populateCartItems
      }
    })
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    })
  }
}

const updateCartItemQty = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || quantity <= 0)
      throw new Error("Invalid data provided");

    const cart = await Cart.findOne({ userId });
    if (!cart)
      throw new Error("Cart not found")

    const findCurrentProduct = cart.items.find(item => item.productId.toString() === productId)
    if (!findCurrentProduct)
      throw new Error("Cart item is not present");

    findCurrentProduct.quantity = quantity;
    await cart.save();

    const populatedCart = await cart.populate({
      path: "items.productId",
      select: "imageUrl title price salePrice"
    })

    const populateCartItems = populatedCart.items.map(item => ({
      productId: item?.productId?._id,
      imageUrl: `${req.protocol}://${req.get("host")}${item.productId.imageUrl}`,
      title: item?.productId?.title,
      price: item?.productId?.price,
      salePrice: item?.productId?.salePrice,
      quantity: item?.quantity,
    }))

    res.status(200).json({
      success: true,
      message: "Update successfully",
      cart: {
        ...populatedCart._doc,
        items: populateCartItems
      }
    })
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    })
  }
}

const deleteCartItem = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    if (!userId || !productId)
      throw new Error("Invalid data provided!")

    const cart = await Cart.findOne({ userId });

    if (!cart)
      throw new Error("Cart not found!")

    cart.items = cart.items.filter(item => item.productId.toString() !== productId)

    await cart.save();

    const populatedCart = await cart.populate({
      path: "items.productId",
      select: "imageUrl title price salePrice"
    })

    const populateCartItems = populatedCart.items.map(item => ({
      productId: item?.productId?._id,
      imageUrl: `${req.protocol}://${req.get("host")}${item.productId.imageUrl}`,
      title: item?.productId?.title,
      price: item?.productId?.price,
      salePrice: item?.productId?.salePrice,
      quantity: item?.quantity,
    }))

    res.status(200).json({
      success: true,
      message: "Delete successfully",
      cart: {
        ...populatedCart._doc,
        items: populateCartItems
      }
    })
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    })
  }
}

module.exports = { addToCart, getCartItems, updateCartItemQty, deleteCartItem }