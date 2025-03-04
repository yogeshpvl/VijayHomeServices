const express = require("express");
const {
  getAllCities,
  createCity,
  updateCity,
  deleteCity,
} = require("../../controllers/city/city");

const router = express.Router();

router.get("/", getAllCities);
router.post("/", createCity);
router.put("/:id", updateCity);
router.delete("/:id", deleteCity);

module.exports = router;
