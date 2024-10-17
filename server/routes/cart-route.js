const { Router } = require("express");
const { addToCart, getCartItems, updateCartItemQty, deleteCartItem } = require("../controllers/cart-controller");

const router = Router();

router.post("/add", addToCart);
router.get("/get/:userId", getCartItems);
router.put("/update-cart", updateCartItemQty);
router.delete("/delete/:userId/:productId", deleteCartItem);

module.exports = router;