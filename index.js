const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const httpStatus = require("./utils/httpStatus");

require("dotenv").config();

const url = process.env.MONGO_URL;

mongoose
  .connect(url)
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log(err));

const app = express();

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routers
const coursesRouter = require("./routes/courses.route");
const usersRouter = require("./routes/users.route");

app.use(express.json());
app.use(cors());

app.use("/api/courses", coursesRouter);
app.use("/api/users", usersRouter);

// global middelware for not found routes
app.all("*", (req, res) => {
  return res.status(404).json({
    status: httpStatus.ERROR,
    message: "this route does not exist",
  });
});

// global error handler
app.use((error, req, res, next) => {
  res.status(error.statusCode || 500).json({
    status: error.statusText || httpStatus.ERROR,
    message: error.message,
    data: null,
    code: error.statusCode || httpStatus.INTERNAL_SERVER,
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server listening at http://localhost:${process.env.PORT}`);
});
