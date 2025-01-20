const jwt = require("jsonwebtoken");
const { JWT_USER_PASSWORD } = require("../config");

const userMiddleware = (req, res, next) => {
  const token = req.headers.token;
  const decoded = jwt.verify(token, JWT_USER_PASSWORD);

  if (decoded) {
    req.userId = decoded.userId;
    next();
  } else {
    res.status(403).json({
      message: "You aren't signed in",
    });
  }
};

module.exports = {
  userMiddleware,
};
