const Listing = require("./models/listing");

module.exports.isLoggedIn = (req, res, next) => {
   
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;

        req.flash("error", "you must be logged in to create listing!")
        return res.redirect("/login")
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async(req, res , next) => {

      const { id } = req.params;
      const listing = await Listing.findById(id);
      //Authorization check
      if (!listing.owner.equals(req.user._id)) {
          req.flash("error", "You are not owner of these listing...!");
          return res.redirect(`/listings/${id}`);
      }
      next();
};

module.exports.isReviewAuther = async(req, res , next) => {

      const { id, reviewId } = req.params;
      const review = await Review.findById( reviewId );
      //Authorization check
      if (!review.auther.equals(req.user._id)) {
          req.flash("error", "You are not owner of these listing...!");
          return res.redirect(`/listings/${id}`);
      }
      next();
};