// src/pages/SignupPage.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const SignupPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    console.log(form);
    try {
      await axios.post("https://services-4zdo.onrender.com/api/user/register", form);
      // alert("Registration successful! You can log in now.");
      toast.success("Registration successful! You can log in now."); 
      navigate("/login");
    } catch (err) {
      setError(
        (err.response && err.response.data.error) || "Registration failed"
      );
      toast.error("Registration failed");
    }
  };

  return (
   <div className="max-w-md mx-auto mt-6 sm:mt-10 bg-white shadow-lg p-6 sm:p-8 rounded-lg">
  <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center text-gray-800">Sign Up</h2>
  
  <form className="space-y-4" onSubmit={handleSubmit}>
    <div>
      <input
        className="w-full border border-gray-300 px-3 py-2 sm:py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        name="name"
        placeholder="Full Name"
        value={form.name}
        onChange={handleChange}
        required
      />
    </div>
    
    <div>
      <input
        className="w-full border border-gray-300 px-3 py-2 sm:py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        name="email"
        type="email"
        placeholder="Email Address"
        value={form.email}
        onChange={handleChange}
        required
      />
    </div>
    
    <div>
      <input
        className="w-full border border-gray-300 px-3 py-2 sm:py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        name="phone"
        type="tel"
        placeholder="Phone Number (Optional)"
        value={form.phone}
        onChange={handleChange}
      />
    </div>
    
    <div>
      <input
        className="w-full border border-gray-300 px-3 py-2 sm:py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        name="password"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        required
      />
    </div>
    
    <button 
      type="submit"
      className="w-full py-3 sm:py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mt-6"
    >
      Create Account
    </button>
  </form>
  
  {error && (
    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
      <p className="text-sm text-red-600">{error}</p>
    </div>
  )}
  
  <div className="mt-6 text-center">
    <p className="text-sm text-gray-600">
      Already have an account?{" "}
      <a 
        className="text-blue-600 hover:text-blue-800 underline font-medium transition-colors" 
        href="/login"
      >
        Sign in here
      </a>
    </p>
  </div>
</div>

  );
};

export default SignupPage;
