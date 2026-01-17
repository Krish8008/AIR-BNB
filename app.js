const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const Reviews = require("./models/reviews.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const { listingSchema, reviewSchema } = require("./schema.js");
const wrapAsync = require("./utilities/wrapAsync.js");
const ExpressError = require("./utilities/expressError.js");
const listing = require("./models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

//Joi validation
const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map(el => el.message).join(",");
    throw new ExpressError(400, errMsg);
  }
  next();
};

//Joi validation
const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map(el => el.message).join(",");
    throw new ExpressError(400, errMsg);
  }
  next();
};

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

// ROOT
app.get("/", (req, res) => {
  res.send("root");
});

// INDEX
app.get("/listings", wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
}));

// NEW
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

// CREATE
app.post("/listings", validateListing, wrapAsync(async (req, res) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
}));

// SHOW (✅ populate reviews)
app.get("/listings/:id", wrapAsync(async (req, res) => {
  const listing = await Listing
    .findById(req.params.id)
    .populate("reviews");

  if (!listing) {
    throw new ExpressError(404, "Listing not found");
  }

  res.render("listings/show.ejs", { listing });
}));

// EDIT
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    throw new ExpressError(404, "Listing not found");
  }
  res.render("listings/edit.ejs", { listing });
}));

// UPDATE
app.put("/listings/:id", validateListing, wrapAsync(async (req, res) => {
  await Listing.findByIdAndUpdate(req.params.id, req.body.listing);
  res.redirect(`/listings/${req.params.id}`);
}));

// DELETE
app.delete("/listings/:id", wrapAsync(async (req, res) => {
  await Listing.findByIdAndDelete(req.params.id);
  res.redirect("/listings");
}));

// CREATE REVIEW 
app.post("/listings/:id/reviews", validateReview, wrapAsync(async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    throw new ExpressError(404, "Listing not found");
  }

  const newReview = new Reviews(req.body.review);
  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();

  res.redirect(`/listings/${listing._id}`);
}));

//DELETE REVIEW
app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;

    const listing = await Listing.findByIdAndUpdate(
        id,
        { $pull: { reviews: reviewId } },
        { new: true }
    );

    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }

    await Reviews.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${listing._id}`);
}));

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
