const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utilities/wrapAsync.js");
const ExpressError = require("../utilities/expressError.js");
const { listingSchema } = require("../schema.js");
const { isLoggedIn } = require("../middleware.js");
const { isOwner } = require("../middleware.js");
const listingController = require("../controllers/listing.js");


/* ---------------- JOI VALIDATION ---------------- */
const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    next();
};

/* ---------------- LISTING ROUTES ---------------- */

// INDEX
router.get("/", wrapAsync(listingController.index));


// NEW
router.get("/new", isLoggedIn, listingController.addNewListing );

// CREATE
router.post("/", validateListing, wrapAsync(listingController.createNewListing));

// SHOW
router.get("/:id", wrapAsync( listingController.showListing));

// EDIT
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync( listingController.editListing));

// UPDATE
router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync( listingController.updateListing ));


// DELETE
router.delete("/:id", isLoggedIn,isOwner, wrapAsync( listingController.deleteListing ));

module.exports = router;

