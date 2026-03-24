import './App.css'
import Navbar from './Navbar/Navabar'
import ListingCard from './Pages/index'
import Footer from './Navbar/Footer/Footer'
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import AddListing from './Pages/AddListing'
import { NavLink } from 'react-router-dom';
import LoginPage from './Pages/Login';
import SignupPage from './Pages/Signup';
import ListingDetails from './Pages/ListingDetails';
import { AuthProvider } from "./AuthContext";

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
        { path: "/", element: <ListingCard /> },
        { path: "/add", element: <AddListing /> },
        { path: "/login", element: <LoginPage /> },
        { path: "/signup", element: <SignupPage /> },
        { path: "/listing/:id", element: <ListingDetails /> }
      ]
    }
  ]);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;