const { Router } = require("express");
const { searchProducts } = require("../controllers/search-controller");

const router = Router();

router.get("/:keyword", searchProducts)

module.exports = router;