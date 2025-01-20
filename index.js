const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();
const { courseRouter } = require("./routes/courses");
const { userRouter } = require("./routes/users");
const { adminRouter } = require("./routes/admin");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/user", userRouter);
app.use("/courses", courseRouter);
app.use("/admin", adminRouter);

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to DB");
  app.listen(process.env.PORT);
  console.log("Listening on port " + process.env.PORT);
}
main();

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/home.html"));
});
