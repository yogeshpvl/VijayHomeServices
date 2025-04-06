const express = require("express");
const router = express.Router();
const controller = require("../../controllers/serviceBooking/resheduledata");

router.post("/", controller.createReschedule);
router.get("/", controller.getAllReschedules); // supports ?service_id=&service_date=
router.get("/:id", controller.getRescheduleById);
router.put("/:id", controller.updateReschedule);
router.delete("/:id", controller.deleteReschedule);

module.exports = router;
