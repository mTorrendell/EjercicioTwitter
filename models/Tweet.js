const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//creamos nuevo Schema
const tweetSchema = new Schema({
  content: {
    type: String,
    maxLength: 140,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  date: {
    type: Date,
    inmutable: true,
    dafault: () => Date.now(),
  },
  //usamos el length del array para averiguar
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

//conectamos con la base de datos
const Tweet = mongoose.model("Tweet", tweetSchema);

module.exports = Tweet;
