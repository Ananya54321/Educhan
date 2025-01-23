const { Router } = require("express");
const adminRouter = Router();
const path = require("path");
const z = require("zod");
const adminSchema = require("../models/adminSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { adminMiddleware } = require("../middleware/admin");

require("dotenv").config();

const saltRounds = 10;

const userValidationSchema = z
  .object({
    firstname: z.string().min(2).max(50),
    lastname: z.string().min(2).max(50),
    email: z.string().email(),
    password: z.string().min(6),
    confirmpassword: z.string().min(6),
  })
  .refine((data) => data.password === data.confirmpassword, {
    message: "Passwords don't match",
    path: ["confirmpassword"],
  });

adminRouter.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/signup.html"));
});

adminRouter.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/login.html"));
});

adminRouter.post("/signup", async (req, res) => {
  console.log(
    req.body.firstname,
    req.body.lastname,
    req.body.email,
    req.body.password,
    req.body.confirmpassword
  );
  // add zod validation
  const result = userValidationSchema.safeParse(req.body);
  if (!result.success) {
    console.log(result.error);
    res.redirect("/admin/signup");
  } else {
    const { firstname, lastname, email, password } = req.body;
    // hash the password so that the plaintext password isnt stored in the DB.
    // let hashedPassword = null;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    // create a new user in the DB
    const user = await adminSchema.create({
      firstname,
      lastname,
      email,
      password: hashedPassword,
    });
    console.log(user);

    res.redirect("/admin/login");
  }
});

adminRouter.post("/login", async (req, res) => {
  console.log(req.body.email, req.body.password);
  const admin = await adminSchema.find({ email: req.body.email });
  console.log(admin);
  const result = bcrypt.compare(req.body.password, admin[0].password);
  if (result) {
    console.log("correct password");
    const token = jwt.sign(
      {
        userId: admin[0]._id,
      },
      process.env.JWT_ADMIN_SECRET
    );
    console.log(token);
    res.redirect("/admin/courses");
  } else res.redirect("/admin/login");
});

// TODO: let the user upload the image instead of inputting the ImageURL
adminRouter.post("/courses", adminMiddleware, async (req, res) => {
  const adminId = req.userId;
  const { title, description, imageURL, price } = req.body;

  const course = await courseModel.create({
    title,
    description,
    imageURL,
    price,
    creatorId: adminId,
  });

  res.json({
    message: "Course Created Successfully",
    course,
  });
});

adminRouter.get("/courses", adminMiddleware, async (req, res) => {
  const adminId = req.userId;
  const courses = await courseModel.find({ creatorId: adminId });
  console.log(courses);
  res.redirect("/admin/courses");
});

module.exports = { adminRouter };
