import React, { useState } from "react";

export default function AddListing() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "", // Changed 'imageLink' to 'image' to match your Joi schema
    price: "",
    country: "",
    location: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3000/listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json" // Tells Express to use express.json()
        },
        // Wrap the data in a 'listing' key to match the backend schema
        body: JSON.stringify({ listing: formData }) 
      });

      const data = await res.json();
      
      if (res.ok) {
        alert("Listing Added!");
        console.log("Success:", data);
      } else {
        console.error("Server Error:", data.message);
        alert(`Error: ${data.message}`);
      }

    } catch (error) {
      console.error("Network Error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Create New Listing</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
          <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
          <input type="text" name="image" placeholder="Image URL" value={formData.image} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
          <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
          <input type="text" name="country" placeholder="Country" value={formData.country} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
          <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
          <button type="submit" className="w-full bg-red-500 text-white font-bold py-3 rounded-lg">Add Listing</button>
        </form>
      </div>
    </div>
  );
}