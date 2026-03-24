import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function ListingDetails() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getListing = async () => {
      try {
        const res = await fetch(`http://localhost:3000/listings/${id}`);
        const data = await res.json();
        setListing(data);
      } catch (err) {
        setError("Failed to load listing.");
        console.log(err);
      }
    };

    getListing();
  }, [id]);

  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;
  if (!listing) return <p className="text-center text-gray-500 mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start py-10 px-4">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden max-w-2xl w-full">

        {/* Image */}
        <div className="relative">
          <img
            src={listing.image.url}
            alt={listing.title}
            className="w-full h-72 object-cover"
          />
          <span className="absolute bottom-4 right-4 bg-black text-white text-sm font-bold px-4 py-2 rounded-full">
            ₹{listing.price.toLocaleString()} / night
          </span>
        </div>

        {/* Content */}
        <div className="p-6">

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{listing.title}</h1>

          {/* Location */}
          <p className="text-sm text-gray-500 mb-4">
            📍 {listing.location}, {listing.country}
          </p>

          {/* Description */}
          <p className="text-gray-600 text-sm leading-relaxed mb-5">
            {listing.description}
          </p>

          <hr className="border-gray-200 mb-5" />

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-400 uppercase font-semibold tracking-wide mb-1">Listing ID</p>
              <p className="text-sm font-semibold text-gray-800">{listing._id.slice(-8).toUpperCase()}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-400 uppercase font-semibold tracking-wide mb-1">Owner ID</p>
              {/* <p className="text-sm font-semibold text-gray-800">{listing.owner.toString().slice(-8).toUpperCase()}</p> */}
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-400 uppercase font-semibold tracking-wide mb-1">Reviews</p>
              <p className="text-sm font-semibold text-gray-800">
                {listing.reviews.length === 0 ? "No reviews yet" : listing.reviews.length}
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-400 uppercase font-semibold tracking-wide mb-1">Price / Night</p>
              <p className="text-sm font-semibold text-gray-800">₹{listing.price.toLocaleString()}</p>
            </div>
          </div>

          <hr className="border-gray-200 mb-5" />

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button className="flex-1 bg-black text-white py-3 rounded-xl font-semibold text-sm hover:bg-gray-800 transition">
              Book Now
            </button>
            <button className="flex-1 border-2 border-black text-black py-3 rounded-xl font-semibold text-sm hover:bg-black hover:text-white transition">
              Contact Owner
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ListingDetails;