"use client";

import { useState } from "react";

export default function Profile() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <div className="w-full">
      {/* Top section */}
      <div className="bg-[#F7F7F5] p-24 ">
        <p className="text-center bg-white max-w-[200px] mx-auto p-1 rounded-2xl justify-center">
          youremail.gmail.com
        </p>
        <p className="max-w-[500px] mx-auto text-center text-6xl mt-4">
          Art Neidich
        </p>
      </div>

      {/* Form */}
      <div className="px-16 py-10">
        <p className="text-2xl font-semibold mb-6">Profile</p>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            {/* Name */}
            <div>
              <label className="block font-medium text-gray-500 mb-2">
                <span className="font-bold">Name *</span>
              </label>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block font-medium text-gray-500 mb-2">
                <span className="font-bold">Email *</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block font-medium text-gray-500 mb-2">
                <span className="font-bold">Phone Number *</span>
              </label>
              <input
                type="tel"
                name="phoneNumber"
                placeholder="Your Phone Number"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end mt-8">
            <button
              type="submit"
              className="px-8 py-3 bg-teal-600 text-white font-medium rounded-full 
              hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 
              flex items-center gap-2"
            >
              Save Changes →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
