import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface Profile {
  name: string;
  email: string;
  phone: string;
}

function UpdateProfile() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  
  const [form, setForm] = useState<Profile>({
    name: "",
    email: "",
    phone: "",
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear previous messages when user starts typing
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        "https://services-4zdo.onrender.com/api/user/profile/update",
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setSuccess("Profile updated successfully!");
      toast.success("Profile updated successfully!");
      
      // Navigate after a short delay to show success message
      setTimeout(() => {
        navigate("/profile");
      }, 1500);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to update profile.";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Update profile error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function fetchProfile() {
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setIsInitialLoading(true);
        const res = await axios.get("https://services-4zdo.onrender.com/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        setForm({
          name: res.data.name || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
        });
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || "Failed to load profile";
        setError(errorMessage);
        toast.error(errorMessage);
        console.error("Fetch profile error:", err);
        
        // If unauthorized, redirect to login
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      } finally {
        setIsInitialLoading(false);
      }
    }
    
    fetchProfile();
  }, [token, navigate]);

  // Show loading spinner while fetching initial data
  if (isInitialLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <div className="flex items-center justify-center">
            <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="ml-3 text-gray-600">Loading profile...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 sm:p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6 text-center">
          Update Profile
        </h2>

        <div className="space-y-4 sm:space-y-5">
          <div>
            <label
              htmlFor="name"
              className="block text-gray-700 font-medium mb-2 text-sm sm:text-base"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              autoComplete="name"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-base"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-gray-700 font-medium mb-2 text-sm sm:text-base"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
              inputMode="email"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-base"
              placeholder="Enter your email address"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-gray-700 font-medium mb-2 text-sm sm:text-base"
            >
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              autoComplete="tel"
              inputMode="tel"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-base"
              placeholder="Enter your phone number"
            />
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-600">{success}</p>
          </div>
        )}

        <div className="mt-6 sm:mt-8 space-y-3">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white py-3 sm:py-4 rounded-md font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-base"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving Changes...
              </span>
            ) : (
              'Save Changes'
            )}
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            disabled={loading}
            className="w-full bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed text-gray-700 py-3 sm:py-4 rounded-md font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-base"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default UpdateProfile;
