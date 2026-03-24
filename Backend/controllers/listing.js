const listing = require("../models/listing");
const Listing = require("../models/listing");



module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    //res.render("listings/index.ejs", { allListings });
    res.json(allListings);
};

module.exports.addNewListing = (req, res) => {
    req.isLoggedIn
    res.render("listings/new.ejs");
};

module.exports.createNewListing = async (req, res) => {
  try {
    const listingData = req.body.listing;

    if (!listingData) {
      return res.status(400).json({ message: "Listing data is required." });
    }

    // Frontend sends image as a plain URL string.
    // Schema expects image: { url, filename } — so reshape it here.
    if (listingData.image && typeof listingData.image === "string") {
      listingData.image = {
        url: listingData.image,
        filename: "listingimage", // default filename
      };
    }

    const newListing = new Listing(listingData);
    // newListing.owner = req.user._id; // uncomment when auth is ready

    await newListing.save();

    res.status(201).json({
      message: "Listing created successfully!",
      listing: newListing,
    });

  } catch (err) {
    console.error("Error creating listing:", err);
    res.status(500).json({ message: err.message || "Internal server error." });
  }
};



module.exports.showListing = async (req, res) => {
    // const listing = await Listing.findById(req.params.id).populate("reviews").populate("owner");
    // if (!listing) {
    //     req.flash("error", "Listing you requested does not exist!"); // Error flash
    //     return res.redirect("/listings");
    // }
    // console.log(listing);
    // res.render("listings/show.ejs", { listing });

    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res.json(listing);
    console.log(listing)
    

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
