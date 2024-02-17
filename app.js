require("dotenv").config();
const express = require("express");
const cors = require("cors");
require("./db/connect");
const userRoutes = require("./routes/userRoutes");
const app = express();
const PORT = 8000;

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/uploads", express.static("./uploads"));
app.use("/files", express.static("./public/files"));
app.use(cors());

app.get("/", (req, res) => {
  res.status(201).end("Server is running");
});

// Routes
app.use(userRoutes);

app.listen(PORT, () => console.log("Server started on PORT:", PORT));
