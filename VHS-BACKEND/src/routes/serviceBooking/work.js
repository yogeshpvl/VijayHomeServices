const express = require("express");
const router = express.Router();
const controller = require("../../controllers/serviceBooking/work");

router.post("/", controller.createMaterial);
router.get("/", controller.getAllMaterials);
router.get("/:id", controller.getMaterialById);
router.put("/:id", controller.updateMaterial);
router.delete("/:id", controller.deleteMaterial);

module.exports = router;
