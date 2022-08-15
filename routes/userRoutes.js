const express = require("express");
const userRouter = express.Router();
const isAuthenticated = require("../middleware/isAuthenticated");
const userController = require("../controllers/userController");
const tweetController = require("../controllers/tweetController");
const alreadyFollows = require("../middleware/follows");
const notFollows = require("../middleware/notFollows");

userRouter.use(isAuthenticated);

userRouter.get("/logout", userController.logoutUser);

userRouter.get("/home", userController.index);

userRouter.post("/home", userController.store);

userRouter.post("/profile/:username", userController.storeProfile);

userRouter.get("/like/:id", tweetController.likes);

userRouter.get("/profile/:username", userController.show);

userRouter.get("/update/:username",  userController.edit);

userRouter.post("/edit/:username",userController.update);

userRouter.get("/show/followers/:username", userController.showFollowers);

userRouter.get("/show/following/:username", userController.showFollowing);

userRouter.get("/delete/:_id",tweetController.destroy);

userRouter.get("/unfollow/:_id", notFollows, userController.unFollow);

userRouter.get("/follow/:_id",  alreadyFollows, userController.follow);

module.exports = userRouter;
