const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require('cors')
const connectDB = require("./config/db");



const app = express();

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }))


if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

dotenv.config({ path: "./config/config.env" });
connectDB();


// THE ROUTERS
app.use('/auth', require('./routes/auth'))
app.use('/room', require('./routes/room'))


const PORT = process.env.PORT || 8000;
app.listen(PORT, console.log(`server is running on port ${PORT}`));
