const User = require("../models/User");

module.exports = async (req, res, next) => {
  const username = await User.findOne({
    username: req.body.username,
  });

  const userEmail = await User.findOne({
    email: req.body.email,
  });

  if (userEmail !== null) {
    return res.redirect("back");
  } else if (username !== null) {
    return res.redirect("back");
  }
  next();
};
