const mongoose = require("mongoose");

const citySchema = new mongoose.Schema({
  city: {
    type: String,
  },
});

const cityymodel = mongoose.model("mastercity", citySchema);
module.exports = cityymodel;
