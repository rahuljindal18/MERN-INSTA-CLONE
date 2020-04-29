const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../keys");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res
      .status(401)
      .json({ error: "You are not authorized to view this resource" });
  }
  const token = authorization.replace("Bearer ", "");
  jwt.verify(token, JWT_SECRET, async (err, data) => {
    if (err) {
      return res
        .status(401)
        .json({ error: "You are not authorized to view this resource" });
    }
    try {
      const _id = data;
      const userData = await User.findById(_id);
      req.user = userData;
      next();
    } catch (error) {
      console.log(error);
    }
  });
};
