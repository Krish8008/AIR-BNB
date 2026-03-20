import React, { useState, useEffect } from "react";

function SkeletonCard() {
  return (
    <div className="w-full animate-pulse">
      <div className="w-full h-56 bg-gray-200 rounded-2xl mb-3" />
      <div className="space-y-2 px-1">
        <div className="flex justify-between">
          <div className="h-4 bg-gray-200 rounded w-2/3" />
          <div className="h-4 bg-gray-200 rounded w-10" />
        </div>
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
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

  const toggleWishlist = (id) => {
    setWishlist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  /* ── Loading skeletons ── */
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4 sm:p-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  /* ── Error state ── */
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 gap-4 p-6 text-center">
        <div className="text-5xl">⚠️</div>
        <h2 className="text-xl font-semibold text-gray-800">Something went wrong</h2>
        <p className="text-gray-500 text-sm max-w-sm">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-5 py-2 bg-rose-500 text-white text-sm font-medium rounded-full hover:bg-rose-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  /* ── Empty state ── */
  if (listings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 gap-3 p-6 text-center">
        <div className="text-5xl">🏠</div>
        <h2 className="text-xl font-semibold text-gray-800">No listings found</h2>
        <p className="text-gray-500 text-sm">Check back later for new places to stay.</p>
      </div>
    );
  }

  /* ── Listings grid ── */
  return (
    <div className="px-4 sm:px-6 py-6">
      {/* Result count */}
      <p className="text-sm text-gray-500 mb-4">
        {listings.length} place{listings.length !== 1 ? "s" : ""} to stay
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-8">
        {listings.map((listing) => (
          <div
            key={listing._id}
            className="group w-full cursor-pointer"
          >
            {/* Image container */}
            <div className="relative overflow-hidden rounded-2xl">
              <img
                src={listing.image?.url}
                alt={listing.title || "Listing"}
                className="w-full h-52 sm:h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/400x300?text=No+Image";
                }}
              />

              {/* Wishlist button */}
              {/* <button
                onClick={() => toggleWishlist(listing._id)}
                aria-label="Toggle wishlist"
                className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow hover:scale-110 transition-transform"
              >
                {wishlist[listing._id] ? "❤️" : "🤍"}
              </button> */}

              {/* Optional badge */}
              {listing.badge && (
                <span className="absolute top-3 left-3 bg-white text-gray-800 text-xs font-semibold px-2 py-1 rounded-full shadow">
                  {listing.badge}
                </span>
              )}
            </div>

            {/* Info */}
            <div className="mt-3 space-y-0.5 px-0.5">
              <div className="flex justify-between items-start gap-2">
                <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-1">
                  {listing.title}
                </h3>
                <span className="flex items-center gap-0.5 text-sm shrink-0">
                  ⭐ <span className="text-gray-700">{listing.rating || "4.5"}</span>
                </span>
              </div>

              <p className="text-gray-400 text-xs line-clamp-1">
                {listing.location || listing.description}
              </p>

              <p className="text-gray-500 text-xs line-clamp-2 mt-0.5">
                {listing.description}
              </p>

              <p className="pt-1 text-sm">
                <span className="font-bold text-gray-900">₹{listing.price?.toLocaleString("en-IN")}</span>
                <span className="text-gray-500"> / night</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ListingCard;