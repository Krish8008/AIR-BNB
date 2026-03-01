import { useState, useRef, useEffect } from "react";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown on outside click
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

        {/* LEFT - Logo */}
        <div className="text-2xl text-rose-500 font-bold cursor-pointer">
          airbnb
        </div>

        {/* MIDDLE - Search Bar */}
        <div className="hidden md:flex flex-1 justify-center px-8">
          <div className="flex items-center border rounded-full px-4 py-2 w-full max-w-md shadow-sm hover:shadow-md transition">
            <input
              type="text"
              placeholder="Search listings..."
              className="flex-1 outline-none text-sm"
            />
            <button className="bg-rose-500 text-white px-4 py-1 rounded-full text-sm">
              Search
            </button>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-6 text-sm font-medium">

          <span className="cursor-pointer hover:text-rose-500 transition">
            All Listings
          </span>

          <span className="cursor-pointer hover:text-rose-500 transition">
            Add Listing
          </span>

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