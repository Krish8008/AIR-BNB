const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js")
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const ExpressError = require("./utilities/expressError.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

/* ---------------- DATABASE ---------------- */
mongoose.connect(MONGO_URL)
  .then(() => console.log("Connected to DB"))
  .catch(err => console.log(err));

/* ---------------- VIEW ENGINE ---------------- */
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/* ---------------- MIDDLEWARE ---------------- */
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

/* ---------------- SESSION ---------------- */
const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

/* ---------------- PASSPORT ---------------- */
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/* ---------------- FLASH MESSAGES ---------------- */
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

/* ---------------- ROUTES ---------------- */

// Root
app.get("/", (req, res) => {
  res.send("Root working ✅");
});

// Demo user (TEST ROUTE)
app.get("/demouser", async (req, res) => {
  try {
    let fakeUser = new User({
      email: "krushnashewale8008@gmail.com",
      username: "krish"
    });

    let registeredUser = await User.register(fakeUser, "Krish@123");
    res.send(registeredUser);
  } catch (err) {
    res.send(err.message);
  }
});

// App routes
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

/* ---------------- 404 ERROR ---------------- */
app.use((req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

/* ---------------- ERROR HANDLER ---------------- */
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("listings/error.ejs", { message });
});

/* ---------------- SERVER ---------------- */
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
