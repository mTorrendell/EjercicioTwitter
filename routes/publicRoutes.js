const express = require("express");
const publicRouter = express.Router();
const pagesController = require("../controllers/pagesController");
const checkRegister = require("../middleware/checkRegister");
const unavaiableRoutesWhenLogedIn = require("../middleware/unavailableRoutes");

const passport = require("passport");

function login(req, res, next) {
  passport.authenticate("local", {
    successRedirect: req.session.redirectTo ? req.session.redirectTo : "/home",
    failureRedirect: "/login",
    failureFlash: true,
  })(req, res, next);
  req.flash("info", "Welcome");
}

// Rutas Públicas:

publicRouter.get("/", pagesController.index);

publicRouter.get("/login", unavaiableRoutesWhenLogedIn, pagesController.createlogin);

publicRouter.post("/login", login);

publicRouter.get("/register", unavaiableRoutesWhenLogedIn, pagesController.createRegister);

publicRouter.post("/register", checkRegister, pagesController.storeRegister);

publicRouter.get("/construction", pagesController.siteInConstruction);

module.exports = publicRouter;
