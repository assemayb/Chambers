const mongoose = require("mongoose");

const TokensSchema = new mongoose.Schema({
  value: {
    type: String,
  },
  username: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("RefreshTokens", TokensSchema);
