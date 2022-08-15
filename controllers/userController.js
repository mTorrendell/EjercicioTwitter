const { User, Tweet } = require("../models");
const formidable = require("formidable");
const path = require("path");
const _ = require("lodash");

async function notFollowing(req, res) {
  const users = await User.find();
  const user = await User.findOne({ username: req.user.username });
  const noFollowing = [];
  for (const oneUser of users) {
    if (!user.following.includes(oneUser._id) && oneUser.id !== user.id) {
      noFollowing.push(oneUser);
    }
  }
  const random3Users = _.sampleSize(noFollowing, 3);
  return random3Users;
}

// Display a listing of the resource.
async function index(req, res) {
  const users = await User.find();
  const userfollowing = req.user.following;
  const user = await User.findOne({ username: req.user.username });

  const random3Users = await notFollowing(req, res);
  const tweets = await Tweet.find({ author: { $in: userfollowing } })
    .sort({ date: "desc" })
    .limit(20);
  res.render("home", {
    tweets,
    users,
    Tweet,
    profilePic: user.profilepicture,
    random3Users,
    user,
  });
}

async function store(req, res) {
  const content = req.body.content;
  const author = req.user._id;

  const createTweet = await Tweet.create({
    content,
    author,
    likes: [],
  });

  await User.findOneAndUpdate(
    { _id: req.user._id },
    { $push: { tweetlist: createTweet._id } }
  );
  res.redirect("/home");
}

async function storeProfile(req, res) {
  const content = req.body.content;
  const author = req.user._id;

  await Tweet.create({
    content,
    author,
    likes: [],
  });

  await User.findOneAndUpdate(
    { _id: req.user._id },
    { $push: { tweetlist: req.user._id } }
  );

  res.redirect("/profile/:username");
}

// Display the specified resource.
async function show(req, res) {
  const oneUser = await User.findOne({
    username: req.params.username,
  }).populate("tweetlist");
  const userLogged = await User.findOne({ username: req.user.username });

  const arrayTweets = oneUser.tweetlist;
  const random3Users = await notFollowing(req, res);
  res.render("profile", { arrayTweets, oneUser, random3Users, userLogged });
}

// Show the form for editing the specified resource.
async function edit(req, res) {
  const oneUser = await User.findOne({ username: req.params.username });
  const fullName = oneUser.name;
  const description = oneUser.description;
  res.render("modifyUser", { fullName, description });
}

// Update the specified resource in storage.
async function update(req, res) {
  const form = formidable({
    multiples: true,
    uploadDir: path.join(__dirname, "../public/img/userProfiles"),
    keepExtensions: true,
  });

  form.parse(req, async (error, fields, files) => {
    const name = fields.name;
    const description = fields.description;
    async function getImage(text, nameUser, property) {
      let retText = "";
      if (text.includes(".")) {
        retText = text;
      } else {
        retText = await User.findOne({ username: nameUser }).property;
      }
      return retText;

    }
    await User.findOneAndUpdate(
      { username: req.user.username },
      {
        name,
        description,
        profilepicture: await getImage(
          files.profilepicture.newFilename,
          req.user.username,
          "profilepicture"
        ),
        backgroundpicture: await getImage(
          files.backgroundpicture.newFilename,
          req.user.username,
          "backgroundpicture"
        ),
      }
    );
    res.redirect("/profile/" + req.user.username);
  });
}

async function logoutUser(req, res) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
}

//shows all of the followes of the loged in user
async function showFollowers(req, res) {
  const userFollowers = await User.findOne({
    username: req.params.username,
  }).populate("followers");
  const otherUser = await User.findOne({ username: req.params.username });

  const random3Users = await notFollowing(req, res);
  res.render("followers", {
    user: req.user,
    otherUser,
    allFollowers: userFollowers.followers,
    allFollowing: otherUser.following,
    random3Users,
  });
}

//shows all of the users the user loged in follows
async function showFollowing(req, res) {
  const userFollowing = await User.findOne({
    username: req.params.username,
  }).populate("following");
  const otherUser = await User.findOne({ username: req.params.username });


  const random3Users = await notFollowing(req, res);
  res.render("following", {
    user: req.user,
    otherUser,
    allFollowing: userFollowing.following,
    allFollowersId: otherUser.following,
    random3Users,
  });
}

//Removes follower
async function unFollow(req, res) {
  const follower = await User.findOne({ _id: req.params._id });

  await User.findOneAndUpdate(
    { _id: req.user._id },
    { $pull: { following: follower._id } }
  );
  await User.findOneAndUpdate(
    { _id: follower._id },
    { $pull: { followers: req.user._id } }
  );

  res.redirect("back");
}

//adds the follower
async function follow(req, res) {
  const follower = await User.findOne({ _id: req.params._id });

  await User.findOneAndUpdate(
    { _id: follower._id },
    { $push: { followers: req.user._id } }
  );
  await User.findOneAndUpdate(
    { _id: req.user._id },
    { $push: { following: follower._id } }
  );

  res.redirect("back");
}

module.exports = {
  index,
  show,
  edit,
  update,
  logoutUser,
  showFollowers,
  showFollowing,
  unFollow,
  follow,
  store,
  storeProfile,
};

//function helpers
