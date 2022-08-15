const User = require("../models/User");
const formidable = require("formidable");
const path = require("path");

async function index(req, res) {
  res.render("welcomePage");
}

async function createlogin(req, res) {
  res.render("login");
}

async function createRegister(req, res) {
  res.render("register");
}

async function storeRegister(req, res) {
    await User.create({
      name:req.body.name,
      email: req.body.email,
      username: req.body.username,
      password:req.body.password,
      profilepicture:"",
      description: "",
      backgroundpicture: "",
    });

    res.redirect("/login");

}

async function siteInConstruction(req, res) {
  res.render("siteInConstruction");
}

module.exports = {
  index,
  createlogin,
  createRegister,
  storeRegister,
  siteInConstruction,
};
