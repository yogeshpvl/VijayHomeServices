const express = require("express");
const {
  getAllResponses,
  getResponseById,
  createResponse,
  updateResponse,
  deleteResponse,
} = require("../../controllers/response/response");

const router = express.Router();

router.get("/", getAllResponses);
router.get("/:id", getResponseById);
router.post("/", createResponse);
router.put("/:id", updateResponse);
router.delete("/:id", deleteResponse);

module.exports = router;
