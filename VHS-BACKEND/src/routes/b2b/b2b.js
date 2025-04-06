const express = require("express");
const router = express.Router();
const b2bController = require("../../controllers/b2b/b2b");

router.post("/", b2bController.createB2B);
router.get("/", b2bController.getAllB2Bs);
router.get("/:id", b2bController.getB2BById);
router.put("/:id", b2bController.updateB2B);
router.delete("/:id", b2bController.deleteB2B);

module.exports = router;
