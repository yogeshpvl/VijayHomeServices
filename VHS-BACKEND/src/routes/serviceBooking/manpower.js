const express = require("express");
const router = express.Router();
const controller = require("../../controllers/serviceBooking/manpower");

router.post("/", controller.createManpower);
router.get("/", controller.getAllManpower); // supports ?service_id=
router.get("/:id", controller.getManpowerById);
router.put("/:id", controller.updateManpower);
router.delete("/:id", controller.deleteManpower);

module.exports = router;
