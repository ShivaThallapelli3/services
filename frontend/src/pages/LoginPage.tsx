// src/pages/LoginPage.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await axios.post(
        "https://services-4zdo.onrender.com/api/user/login",
        form
      );
      localStorage.setItem("token", data.token); // Save JWT!
      localStorage.setItem("user_name", data.name || "User");
      navigate("/"); // Go home after login
      toast.success("Login successfully");
    } catch (err) {
      setError((err.response && err.response.data.error) || "Login failed");
      toast.error("Login Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
  <div className="max-w-md w-full space-y-6">
    <div className="bg-white shadow-lg rounded-lg p-6 sm:p-8">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Welcome Back
        </h2>
        <p className="text-sm text-gray-600">
          Sign in to your emergency services account
        </p>
      </div>

      {/* Form */}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className="sr-only">
            Email address
          </label>
          <input
            id="email"
            className="w-full border border-gray-300 px-3 py-2.5 sm:py-3 rounded-md text-sm sm:text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            name="email"
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
            required
            autoComplete="email"
          />
        </div>
        
        <div>
          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <input
            id="password"
            className="w-full border border-gray-300 px-3 py-2.5 sm:py-3 rounded-md text-sm sm:text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
          />
        </div>

        <button 
          type="submit"
          className="w-full py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium text-sm sm:text-base rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm hover:shadow-md touch-manipulation"
        >
          Sign In
        </button>
      </form>

      {/* Error Message */}
      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm">
          <div className="flex items-center">
            <svg className="h-4 w-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        </div>
      )}

      {/* Sign Up Link */}
      <div className="mt-6 text-center border-t pt-4">
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <a 
            className="text-blue-600 hover:text-blue-700 underline font-medium" 
            href="/signup"
          >
            Create account
          </a>
        </p>
      </div>
    </div>

    {/* Additional Help Text */}
    <div className="text-center">
      <p className="text-xs text-gray-500 max-w-sm mx-auto">
        Your account helps us provide personalized emergency services and maintain your emergency contacts.
      </p>
    </div>
  </div>
</div>
  );
};

export default LoginPage;
