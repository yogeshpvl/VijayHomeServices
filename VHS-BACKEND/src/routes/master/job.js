const express = require("express");
const router = express.Router();
const controller = require("../../controllers/master/job");

router.get("/", controller.getAll);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);
router.get("/category/:category", controller.getByCategory);
router.get("/material/:material", controller.getByMaterial);

module.exports = router;
