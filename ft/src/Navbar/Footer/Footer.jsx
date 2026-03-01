import React from "react";

function Footer() {
  return (
    <footer className="bg-gray-100 mt-16 border-t">

      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-gray-700">
        
        {/* Support */}
        <div>
          <h3 className="font-semibold mb-4">Support</h3>
          <ul className="space-y-2">
            <li className="hover:underline cursor-pointer">Help Center</li>
            <li className="hover:underline cursor-pointer">AirCover</li>
            <li className="hover:underline cursor-pointer">Safety Information</li>
            <li className="hover:underline cursor-pointer">Cancellation Options</li>
          </ul>
        </div>

        {/* Hosting */}
        <div>
          <h3 className="font-semibold mb-4">Hosting</h3>
          <ul className="space-y-2">
            <li className="hover:underline cursor-pointer">Airbnb your home</li>
            <li className="hover:underline cursor-pointer">Hosting Resources</li>
            <li className="hover:underline cursor-pointer">Community Forum</li>
          </ul>
        </div>

        {/* Airbnb */}
        <div>
          <h3 className="font-semibold mb-4">Airbnb</h3>
          <ul className="space-y-2">
            <li className="hover:underline cursor-pointer">Newsroom</li>
            <li className="hover:underline cursor-pointer">Careers</li>
            <li className="hover:underline cursor-pointer">Investors</li>
          </ul>
        </div>

      </div>

      {/* Bottom Section */}
      <div className="border-t">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
          
          <p>© 2026 Airbnb Clone, Inc.</p>

          <div className="flex gap-4 mt-2 md:mt-0">
            <span className="hover:underline cursor-pointer">Privacy</span>
            <span className="hover:underline cursor-pointer">Terms</span>
            <span className="hover:underline cursor-pointer">Sitemap</span>
          </div>

        </div>
      </div>

    </footer>
  );
}

export default Footer;