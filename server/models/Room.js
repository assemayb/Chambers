const mongoose = require("mongoose");

const RoomsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Room", RoomsSchema);
