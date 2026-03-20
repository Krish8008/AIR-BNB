import './App.css'
import Navbar from './Navbar/Navabar'
import ListingCard from './Listings/index'
import Footer from './Navbar/Footer/Footer'
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import AddListing from './Listings/addListing'
import { NavLink } from 'react-router-dom';

/* Layout Component */
function Layout() {
  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 mt-8 min-h-screen">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}

function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <ListingCard />
        },
        {
          path: "/add",
          element: <AddListing />
        }
      ]
    }
  ]);

  return <RouterProvider router={router} />;
}

export default App;