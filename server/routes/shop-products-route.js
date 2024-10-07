const { Router } = require("express");
const { getFilteredProducts } = require("../controllers/shop-products-controller");

const router = Router();

router.get("/get", getFilteredProducts)

module.exports = router;