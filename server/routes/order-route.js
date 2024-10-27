const { Router } = require("express");
const { createOrder, capturePayment, getAllOrdersByUser, getOrderDetails, continuePayment } = require("../controllers/order-controller");

const router = Router();

router.post("/create", createOrder);
router.post("/capture", capturePayment);
router.post("/continue", continuePayment);
router.get("/list/:userId", getAllOrdersByUser);
router.get("/details/:id", getOrderDetails);

module.exports = router;