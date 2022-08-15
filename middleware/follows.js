const User = require("../models/User");

module.exports = async (req, res, next) => {
  const user = await User.findOne({ username: req.user.username });
  const userFollows = user.following;
  if (userFollows.includes(req.params._id)) {
    return res.redirect("/" + req.user.username);
  }
  next();
};
