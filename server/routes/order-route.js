const { Router } = require("express");
const { createOrder, capturePayment } = require("../controllers/order-controller");

const router = Router();

router.post("/create", createOrder);
router.post("/capture", capturePayment);

module.exports = router;