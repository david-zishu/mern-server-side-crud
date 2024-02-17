const mongoose = require("mongoose");
const DB = process.env.DATABASE;
mongoose
  .connect(DB)
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log(err));

// 47.9.150.9/32
