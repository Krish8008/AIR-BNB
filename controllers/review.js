const Reviews = require("../models/reviews.js");
const Listing = require("../models/listing.js");

module.exports.createReview = async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }

    const newReview = new Reviews(req.body.review);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success", "New Review Created!"); // Success Flash
    res.redirect(`/listings/${listing._id}`);
  };

  module.exports.deleteReview = async (req, res) => {
      const { id, reviewId } = req.params;
  
      // Remove review reference from Listing
      const listing = await Listing.findByIdAndUpdate(
        id,
        { $pull: { reviews: reviewId } }
      );
  
      if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
      }
  
      // Delete the actual review document
      await Reviews.findByIdAndDelete(reviewId);
  
      req.flash("success", "Review Deleted!"); // Success Flash
      res.redirect(`/listings/${id}`);
    };