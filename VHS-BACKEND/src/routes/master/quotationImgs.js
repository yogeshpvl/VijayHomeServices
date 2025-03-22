const express = require("express");
const router = express.Router();
const controller = require("../../controllers/master/quotationImgs");
const multer = require("multer");

// Use memory storage (no uploads folder required)
const upload = multer({ storage: multer.memoryStorage() });

// Routes
router.post("/create", upload.single("image"), controller.create);
router.put("/:id", upload.single("image"), controller.update);
router.get("/", controller.getAll);
router.get("/category", controller.getImageswithquery);
router.delete("/:id", controller.remove);

module.exports = router;
