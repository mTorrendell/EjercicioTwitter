const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

//creamos nuevo Schema
const userSchema = new Schema({
  name: String,
  username: String,
  email: String,
  password: String,
  description: String,
  profilepicture: String,
  backgroundpicture: String,
  tweetlist: [
    {
      type: Schema.Types.ObjectId,
      ref: "Tweet",
    },
  ],
  followers: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  following: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

userSchema.pre("save", async function (req, res, next) {
  const user = this;
  user.password = await bcrypt.hash(user.password, 10);
  return next();
});

//conectamos con la base de datos
const User = mongoose.model("User", userSchema);

module.exports = User;
