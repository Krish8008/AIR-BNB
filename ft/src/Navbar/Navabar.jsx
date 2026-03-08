import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white shadow-md px-6 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="text-2xl text-rose-500 font-bold">
          airbnb
        </Link>

        {/* Search */}
        <div className="hidden md:flex flex-1 justify-center px-8">
  <div className="flex items-center border rounded-full px-4 py-2 w-full max-w-md shadow-sm hover:shadow-md transition">
    <input
      type="text"
      placeholder="Search listings..."
      className="flex-1 outline-none text-sm bg-transparent"
    />
    <button className="bg-rose-500 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-rose-600 transition">
      Search
    </button>
  </div>
</div>

        {/* Right Section */}
        <div className="flex items-center gap-6 text-sm font-medium">

          <Link to="/" className="hover:text-rose-500">
            All Listings
          </Link>

          <Link to="/add" className="hover:text-rose-500">
            Add Listing
          </Link>

          {/* Profile */}
          <div className="relative" ref={menuRef}>
            <div
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 border rounded-full p-2 cursor-pointer hover:shadow-md"
            >
              ☰
              <span className="bg-gray-500 text-white rounded-full px-2 py-1 text-xs">
                👤
              </span>
            </div>

            {menuOpen && (
              <div className="absolute right-0 top-12 bg-white shadow-lg rounded-xl w-44 p-4 flex flex-col gap-3 text-sm">
                <span className="cursor-pointer hover:text-rose-500">
                  Sign up
                </span>
                <span className="cursor-pointer hover:text-rose-500">
                  Log in
                </span>
                <hr />
                <span className="cursor-pointer hover:text-rose-500">
                  Help Center
                </span>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;