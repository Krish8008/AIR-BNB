import React, { useState, useEffect } from "react";

function ListingCard() {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/listings")
      .then((res) => res.json())
      .then((data) => {
        setListings(data);
      })
      .catch((err) => console.log(err));
  }, []);

 return (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 p-8 justify-items-center">
    {listings.map((listing) => (
      <div key={listing._id} className="w-72 cursor-pointer">

        <div className="relative">
          <img
            src={listing.image?.url}
            alt="listing"
            className="w-full h-72 object-cover rounded-xl"
          />

          <span className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md">
            ❤️
          </span>
        </div>

        <div className="mt-3 space-y-1">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-900">
              {listing.title}
            </h3>

            <span className="flex items-center gap-1 text-sm">
              ⭐ {listing.rating || "4.5"}
            </span>
          </div>

          <p className="text-gray-500 text-sm">
            {listing.description}
          </p>

          <p className="mt-1">
            <span className="font-semibold">₹{listing.price}</span> night
          </p>
        </div>

      </div>
    ))}
  </div>
);
}

export default ListingCard;