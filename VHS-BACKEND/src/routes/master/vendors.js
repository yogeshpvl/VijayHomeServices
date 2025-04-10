const express = require("express");
const router = express.Router();
const vendorController = require("../../controllers/master/vendors");

router.post("/register", vendorController.register);
router.post("/bulkRegister", vendorController.bulkRegister);
router.get("/filter", vendorController.getByCityAndCategory); // ?city=Bangalore&category=Cleaning
router.get("/filterForDSR", vendorController.getByCityAndCategoryForDSRReport); // ?city=Bangalore&category=Cleaning

router.post("/login", vendorController.login);
router.get("/", vendorController.getAll);

router.get("/:id", vendorController.getById);
router.get("/type/:type", vendorController.getByType);
router.get("/city/:city", vendorController.getByCity);
router.put("/edit/:id", vendorController.edit);
router.delete("/:id", vendorController.delete);
router.put("/block/:id", vendorController.block);
router.post("/logout", vendorController.logout);
router.post("/change-password", vendorController.changePassword);

module.exports = router;
