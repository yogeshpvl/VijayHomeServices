const express = require("express");
const router = express.Router();
const controller = require("../../controllers/1community/community");

router.post("/", controller.createCommunity);
router.get("/", controller.getAllCommunities);
router.get("/:id", controller.getCommunityById);
router.put("/:id", controller.updateCommunity);
router.delete("/:id", controller.deleteCommunity);

module.exports = router;
