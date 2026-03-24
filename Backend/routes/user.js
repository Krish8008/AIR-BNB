const express = require("express");
const router = express.Router({ mergeParams: true });
const { userSchema } = require("../schema.js");
const ExpressError = require("../utilities/expressError.js");
const User = require("../models/user.js");
const wrapAsync = require("../utilities/wrapAsync.js");
const passport = require("passport");
const { Strategy } = require("passport-local");
const { saveRedirectUrl } = require("../middleware.js");




const validateUser = (req, res, next) => {
  const { error } = userSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }
  next();
};


const validateLogin = (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Username and password are required"
    });
  }

  next();
};

 
router.get("/signup", (req, res) => {
     res.render("users/signup.ejs");
})

router.post("/signup", validateUser, wrapAsync(async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const newUser = new User({ username, email });

    const registeredUser = await User.register(newUser, password);

    // auto login
    req.login(registeredUser, (err) => {
      if (err) return next(err);

      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        redirectUrl: "/#"
      });
    });

  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
}));


router.get("/login", (req, res) => {
     res.render("users/login.ejs");
})

router.post("/login", validateLogin, (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {

    if (err) return next(err);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid username or password"
      });
    }

    req.login(user, (err) => {
      if (err) return next(err);

      return res.json({
        success: true,
        message: "Login successful",
        redirectUrl: "/#"
      });
    });

  })(req, res, next);
});



router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if(err){
      return next(err);
    }
    req.flash("success", "You are logged out!");
    res.redirect("/listings");
    
  })
});



module.exports = router;