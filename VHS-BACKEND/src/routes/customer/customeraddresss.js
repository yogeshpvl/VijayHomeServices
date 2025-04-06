const express = require("express");
const router = express.Router();
const userAddressController = require("../../controllers/customer/customeraddresss");

router.post("/address", userAddressController.createAddress);
router.delete("/address/:id", userAddressController.deleteAddress);
router.get("/address/user/:user_id", userAddressController.getAddressesByUser);

module.exports = router;
