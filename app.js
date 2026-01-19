const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const listings = require("./routes/listing.js")
const reviews = require("./routes/review.js")
const { reviewSchema } = require("./schema.js");
const flash = require("connect-flash");
const session = require("express-session")


const ExpressError = require("./utilities/expressError.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";




// DB connection
mongoose.connect(MONGO_URL)
  .then(() => console.log("Connected to DB"))
  .catch(err => console.log(err));

// View engine
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  }
}

// ROOT
app.get("/", (req, res) => {
  res.send("root");
});

app.use(session(sessionOptions));
app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  next();
});

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);


// 404
app.use((req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

// ERROR HANDLER (FIXED)
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("listings/error.ejs", { message });
});

// SERVER
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
