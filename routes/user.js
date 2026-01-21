const express = require("express");
const router = express.Router({ mergeParams: true });
const { userSchema } = require("../schema.js");
const ExpressError = require("../utilities/expressError.js");
const User = require("../models/user.js");
const wrapAsync = require("../utilities/wrapAsync.js");
const passport = require("passport");
const { Strategy } = require("passport-local");



const validateUser = (req, res, next) => {
  const { error } = userSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error.details[0].message);
  }
  next();
};

 
router.get("/signup", (req, res) => {
     res.render("users/signup.ejs");
})

router.post("/signup", validateUser, wrapAsync(async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // create user object
    const newUser = new User({ username, email });

    // 🔥 saves user in DB
    const registeredUser = await User.register(newUser, password);

    // auto login
    req.login(registeredUser, err => {
      if (err) return next(err);
      req.flash("success", "Welcome! Account created.");
      res.redirect("/listings");
    });

  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/signup");
  }
}));


router.get("/login", (req, res) => {
     res.render("users/login.ejs");
})


router.post("/login", 
  passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
}), 
async (req, res) => {
  res.send("Welcome to wonderlust, you are loged in!")
})



module.exports = router;