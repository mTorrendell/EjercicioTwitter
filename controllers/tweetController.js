const { User, Tweet } = require("../models");


// Dar y sacar Likes
async function likes(req, res) {
  const tweet = await Tweet.findOne({ _id: req.params.id });
  if (tweet.likes.includes(req.user._id) === false) {
    tweet.likes.push(req.user._id);
    tweet.save();
  } else {
    tweet.likes.pull({ _id: req.user._id });
    tweet.save();
  }

  res.redirect("/home");
}

// Remove the specified resource from storage.
async function destroy(req, res) {
  await Tweet.deleteOne({ _id: req.params._id });
  await User.findOneAndUpdate({ _id: req.user._id }, { $pull: { tweetlist: req.params._id } });
  res.redirect("back");
}


module.exports = {
  destroy,
  likes,
};
