const express = require("express");
const router = express.Router();
const customerController = require("../../controllers/customer/customer");

router.post("/create", customerController.create);

router.post("/registerorlogin", customerController.registerorlogin);
router.post("/registerorloginweb", customerController.registerorloginwebsite);

router.post("/login", customerController.login);
router.get("/last-cardno", customerController.getLastCardNo);
router.get("/search", customerController.searchCustomers);
router.get("/totalCounts", customerController.gettotalCounts);

router.get("/", customerController.getAll);
router.get("/:id", customerController.getOne);
router.put("/update/:id", customerController.update);
router.get("/by-contact/:contact", customerController.getOneByContact);

router.delete("/:id", customerController.remove);

module.exports = router;
