const express = require("express");
const router = express.Router();
const controller = require("../../controllers/b2b/b2bfollowups");

router.post("/", controller.createFollowup);
router.get("/", controller.getAllFollowups);
router.get("/:id", controller.getFollowupById);
router.put("/:id", controller.updateFollowup);
router.delete("/:id", controller.deleteFollowup);

module.exports = router;
