require("dotenv").config();

const express = require("express");
const routes = require("./routes");
const seeder1 = require("./seeders/userSeeder.js");
const seeder2 = require("./seeders/tweetSeeder.js");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const localVariables = require("./middleware/localVariables");
const methodOverride = require("method-override");
const flash = require("express-flash");

const mongoose = require("./mongoose/dbInitialSetup");
mongoose.connection
  .once("open", () => console.log("¡Conexión con la base de datos establecida!"))
  .on("error", (error) => console.log(error));

//IIFE
/*
(async function () {
  await seeder1();
  await seeder2();
  console.log("la base de datos fue ejecutada");
})();
*/
const APP_PORT = process.env.APP_PORT || 8000;
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
//app.use(methodOverride);

app.use(
  session({
    secret: "equipoDos",
    resave: false,
    saveUninitialized: false,
  }),
);

app.use(passport.session());
app.use(flash());

passport.use(
  new LocalStrategy({ usernameField: "usernameEmail" }, async (usernameEmail, password, done) => {
    const user = await User.findOne({
      $or: [{ username: usernameEmail }, { email: usernameEmail }],
    });

    if (!user) {
      return done(null, false, { message: "Invalide credentiales" });
    }
    const verifyPasswordUsername = await bcrypt.compare(password, user.password);

    if (!verifyPasswordUsername) {
      return done(null, false, { message: "Credenciales invalidas" });
    }
    return done(null, user);
  }),
);
passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser(function (_id, done) {
  User.findById(_id)
    .then((user) => {
      done(null, user); // Usuario queda disponible en req.user.
    })
    .catch((error) => {
      done(error, user);
    });
});

app.use(localVariables);
routes(app);

app.listen(APP_PORT, () => {
  console.log(`\n[Express] Servidor corriendo en el puerto ${APP_PORT}.`);
  console.log(`[Express] Ingresar a http://localhost:${APP_PORT}.\n`);
});
