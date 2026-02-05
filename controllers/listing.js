const Listing = require("../models/listing");


module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.addNewListing = (req, res) => {
    req.isLoggedIn
    res.render("listings/new.ejs");
};

module.exports.createNewListing = async (req, res) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "Successfully made a new listing!"); // Flash added
    res.redirect("/listings");
};

module.exports.showListing = async (req, res) => {
    const listing = await Listing.findById(req.params.id).populate("reviews").populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested does not exist!"); // Error flash
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
};

module.exports.editListing = async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
};


module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, req.body.listing);

    req.flash("success", "Listing Updated Successfully!");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
    await Listing.findByIdAndDelete(req.params.id);
    req.flash("success", "Listing Deleted!"); // Flash added
    res.redirect("/listings");
};
