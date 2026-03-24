import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const { user, setUser } = useAuth(); // ⭐ Auth

  // Close menu on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Logout
  const handleLogout = async () => {
    await fetch("http://localhost:3000/logout", {
      credentials: "include",
    });

    setUser(null);
    navigate("/");
  };

  return (
    <nav className="bg-white border-b border-gray-100 px-6 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center gap-6">

        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-semibold tracking-tight text-gray-900 shrink-0"
        >
          <span className="text-rose-500">air</span>bnb
        </Link>

        {/* Search */}
        <div className="hidden md:flex flex-1 justify-center">
          <div
            className={`flex items-center gap-2 border rounded-xl px-4 py-2.5 w-full max-w-lg transition-all duration-200 bg-gray-50 ${
              searchFocused
                ? "border-gray-300 bg-white shadow-sm ring-1 ring-gray-200"
                : "border-gray-200 hover:border-gray-300 hover:bg-white"
            }`}
          >
            <svg
              className="w-4 h-4 text-gray-400 shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>

            <input
              type="text"
              placeholder="Search destinations, listings..."
              className="flex-1 outline-none text-sm bg-transparent text-gray-800 placeholder-gray-400"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />

            <button className="bg-rose-500 hover:bg-rose-600 text-white px-3.5 py-1.5 rounded-lg text-sm font-medium">
              Search
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-1 text-sm font-medium shrink-0">
          <Link
            to="/"
            className="px-3 py-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            Listings
          </Link>

          <Link
            to="/add"
            className="px-3 py-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            Add Listing
          </Link>

          {/* Profile */}
          <div className="relative ml-2" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 border rounded-xl px-3 py-2 hover:shadow-sm"
            >
              {/* Menu icon */}
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                viewBox="0 0 24 24"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>

              {/* Avatar */}
              <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                </svg>
              </div>

              {/* Username (optional) */}
              {user && (
                <span className="hidden md:block text-gray-700 text-sm">
                  {user.username}
                </span>
              )}
            </button>

            {/* Dropdown */}
            {menuOpen && (
              <div className="absolute right-0 top-14 bg-white border border-gray-100 shadow-lg rounded-xl w-44 py-2 flex flex-col text-sm">

                {user ? (
                  <>
                    <div className="px-4 py-2 text-gray-700 font-medium">
                      Hello, {user.username} 👋
                    </div>

                    <button
                      onClick={() => {
                        handleLogout();
                        setMenuOpen(false);
                      }}
                      className="text-left px-4 py-2.5 text-gray-700 hover:bg-gray-50"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        navigate("/signup");
                        setMenuOpen(false);
                      }}
                      className="text-left px-4 py-2.5 text-gray-700 hover:bg-gray-50"
                    >
                      Sign up
                    </button>

                    <button
                      onClick={() => {
                        navigate("/login");
                        setMenuOpen(false);
                      }}
                      className="text-left px-4 py-2.5 text-gray-700 hover:bg-gray-50"
                    >
                      Log in
                    </button>
                  </>
                )}

                <div className="border-t border-gray-100 my-1" />

                <button
                  onClick={() => {
                    navigate("/help");
                    setMenuOpen(false);
                  }}
                  className="text-left px-4 py-2.5 text-gray-500 hover:bg-gray-50"
                >
                  Help Center
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;