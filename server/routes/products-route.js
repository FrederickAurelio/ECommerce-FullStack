const { Router } = require("express");
const { createProduct, getAllProducts, editProduct, deleteProduct, imgUpload } = require("../controllers/products-controller");

const router = Router();

const { authMiddleware } = require("../controllers/auth-controller");

router.post("/create", authMiddleware, imgUpload.single('imageFile'), createProduct);
router.get("/get", getAllProducts);
router.put("/edit/:id", authMiddleware, imgUpload.single("imageFile"), editProduct);
router.delete("/delete/:id", authMiddleware, deleteProduct);

module.exports = router;