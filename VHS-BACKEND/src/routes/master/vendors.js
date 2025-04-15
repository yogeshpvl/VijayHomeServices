const express = require("express");
const router = express.Router();
const vendorController = require("../../controllers/master/vendors");

const multer = require("multer");

// Use memory storage (no uploads folder required)
const upload = multer({ storage: multer.memoryStorage() });

router.post("/register", vendorController.register);
router.post("/bulkRegister", vendorController.bulkRegister);
router.get("/filter", vendorController.getByCityAndCategory); // ?city=Bangalore&category=Cleaning
router.get("/filterForDSR", vendorController.getByCityAndCategoryForDSRReport); // ?city=Bangalore&category=Cleaning
router.post("/change-password", vendorController.changePassword);

router.post("/techlogin", vendorController.techlogin);
router.post("/exelogin", vendorController.exelogin);
router.post("/pmlogin", vendorController.pmlogin);
router.post("/vendorlogin", vendorController.vendorlogin);
router.put(
  "/updateDocuments",
  upload.single("image"),
  vendorController.updatevendordocuments
);

router.get("/", vendorController.getAll);

router.get("/:id", vendorController.getById);
router.get("/type/:type", vendorController.getByType);
router.get("/city/:city", vendorController.getByCity);
router.put("/edit/:id", vendorController.edit);
router.delete("/:id", vendorController.delete);
router.put("/block/:id", vendorController.block);
router.post("/logout", vendorController.logout);

module.exports = router;
