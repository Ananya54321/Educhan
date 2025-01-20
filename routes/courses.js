const { Router } = require("express");
const path = require("path");

const courseRouter = Router();

courseRouter.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/courses.html"));
});

courseRouter.post("/:courseId/purchase", (req, res) => {
  res.send("do you want to purchase course : " + req.params.courseId);
});

courseRouter.get("/:courseId", (req, res) => {
  res.send("course id : " + req.params.courseId);
});

courseRouter.get("/purchases", (req, res) => {
  res.send("purchases");
});

module.exports = { courseRouter };
