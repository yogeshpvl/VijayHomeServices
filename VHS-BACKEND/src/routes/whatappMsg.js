const axios = require("axios");
const express = require("express");
const router = express.Router();

router.post("/send-message", async (req, res) => {
  try {
    const { mobile, msg } = req.body;
    // URL encode the message only once
    const encodedMsg = encodeURIComponent(msg);

    const apiURL = `https://web.cloudwhatsapp.com/wapp/api/send?apikey=ed90cfb9843241b3afb223e56e64aa0c&mobile=${mobile}&msg=${encodedMsg}`;

    const response = await axios.post(apiURL);

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
