const express = require("express");
const router = express.Router();
const controller = require("../../controllers/quote/quoteFollowup");

router.get("/confirmedquotations", controller.fetchConfirmedFollowups);
router.get("/latest-callbacks", controller.fetchLatestCallFollowups);

router.post("/", controller.createFollowup);
router.get("/:enquiry_id", controller.getAllFollowups);
router.get("/:id", controller.getFollowupById);
router.put("/:id", controller.updateFollowup);
router.delete("/:id", controller.deleteFollowup);

module.exports = router;
