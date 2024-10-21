const { Router } = require("express");
const { addAddress, getAllAddress, editAddress, deleteAddress } = require("../controllers/address-controller");

const router = Router();

router.post("/add", addAddress);
router.get("/get/:userId", getAllAddress);
router.put("/update/:userId/:addressId", editAddress);
router.delete("/delete/:userId/:addressId", deleteAddress);

module.exports = router;