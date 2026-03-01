const mongoose = require("mongoose");
const { listingSchema } = require("../schema");
const Schema = mongoose.Schema;
const Review = require("./reviews.js");


const ListingSchema = new Schema({
  title: { type: String, required: true },
  description: String,

  image: {
    filename: { type: String, default: "listingimage" },
    url: {
      type: String,
      default:
        "https://i0.wp.com/picjumbo.com/wp-content/uploads/beautiful-fall-nature-scenery-free-image.jpeg?w=2210&quality=70",
      set: v =>
        v === ""
          ? "https://i0.wp.com/picjumbo.com/wp-content/uploads/beautiful-fall-nature-scenery-free-image.jpeg?w=2210&quality=70"
          : v,
    },
  },

  price: { type: Number, required: true, min: 0 },
  location: { type: String, required: true },
  country: { type: String, default: "India" },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review"
    }
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
});


ListingSchema.post("findOneAndDelete", async function (listing) {
  if (listing) {
    await Review.deleteMany({
      _id: { $in: listing.reviews },
    });
  }
});

module.exports = mongoose.model("Listing", ListingSchema);
