import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function SkeletonCard() {
  return (
    <div className="w-full animate-pulse">
      <div className="w-full h-60 bg-gray-200 rounded-3xl mb-3" />
      <div className="space-y-2 px-1">
        <div className="h-4 bg-gray-200 rounded-full w-2/3" />
        <div className="h-3 bg-gray-200 rounded-full w-1/3" />
        <div className="h-3 bg-gray-200 rounded-full w-full" />
        <div className="h-3 bg-gray-200 rounded-full w-1/2" />
      </div>
    </div>
  );
}

function ListingCard() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlist, setWishlist] = useState({});

  useEffect(() => {
    fetch("http://localhost:3000/listings")
      .then((res) => {
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setListings(Array.isArray(data) ? data : data.listings || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const toggleWishlist = (e, id) => {
    e.preventDefault();
    setWishlist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-6 py-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 gap-4 p-6 text-center">
        <div className="text-5xl">⚠️</div>
        <h2 className="text-xl font-semibold text-gray-800">Something went wrong</h2>
        <p className="text-gray-400 text-sm max-w-sm">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-6 py-2.5 bg-rose-500 text-white text-sm font-semibold rounded-full hover:bg-rose-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 gap-3 p-6 text-center">
        <div className="text-5xl">🏠</div>
        <h2 className="text-xl font-semibold text-gray-800">No listings found</h2>
        <p className="text-gray-400 text-sm">Check back later for new places to stay.</p>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 py-8 bg-white min-h-screen">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Places to Stay</h2>
        <span className="text-sm text-gray-400 bg-gray-100 px-3 py-1 rounded-full font-medium">
          {listings.length} listing{listings.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
        {listings.map((listing) => (
          <Link
            to={`/listing/${listing._id}`}
            key={listing._id}
            // Reset all link styles here
            style={{ textDecoration: "none", color: "inherit" }}
            className="group w-full block"
          >
            {/* Image */}
            <div className="relative overflow-hidden rounded-3xl bg-gray-100">
              <img
                src={listing.image?.url}
                alt={listing.title || "Listing"}
                className="w-full h-60 object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://placehold.co/400x300?text=No+Image";
                }}
              />

              {/* Wishlist button */}
              <button
                onClick={(e) => toggleWishlist(e, listing._id)}
                className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:scale-110 transition-transform duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill={wishlist[listing._id] ? "#f43f5e" : "none"}
                  stroke={wishlist[listing._id] ? "#f43f5e" : "#9ca3af"}
                  strokeWidth={2}
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                  />
                </svg>
              </button>

              {/* Price badge */}
              <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                ₹{listing.price?.toLocaleString()}{" "}
                <span className="font-normal text-gray-500">/ night</span>
              </div>
            </div>

            {/* Text — explicitly set colors to override any global `a` styles */}
            <div className="mt-3 px-0.5 space-y-1">
              <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-1 group-hover:text-rose-500 transition-colors no-underline">
                {listing.title}
              </h3>

              <p className="text-gray-400 text-xs no-underline">
                📍 {listing.location}, {listing.country}
              </p>

              <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed no-underline">
                {listing.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ListingCard;