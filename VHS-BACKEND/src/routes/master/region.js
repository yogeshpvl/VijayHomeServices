const express = require("express");
const router = express.Router();
const controller = require("../../controllers/master/region");

router.get("/", controller.getAll);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);
router.get("/category/:category", controller.getByCategory);

module.exports = router;
