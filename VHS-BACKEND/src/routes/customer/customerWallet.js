const express = require("express");
const router = express.Router();
const walletController = require("../../controllers/customer/customerWallet");

router.post("/wallet/add", walletController.addWalletEntry);
router.get("/wallet/:userId", walletController.getWalletHistoryByUser);

module.exports = router;
