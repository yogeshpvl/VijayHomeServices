const express = require("express");
const router = express.Router();
const controller = require("../../controllers/serviceBooking/rMaterials");

router.post("/", controller.createRMaterial);
router.get("/", controller.getAllRMaterials); // supports ?service_id=&customer_id=
router.get("/:id", controller.getRMaterialById);
router.put("/:id", controller.updateRMaterial);
router.delete("/:id", controller.deleteRMaterial);

module.exports = router;
