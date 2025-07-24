// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EmergencyPage from "./pages/EmergencyPage";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfileInfoPage from "./pages/ProfileInfoPage";
import AddContactForm from "./pages/AddContactForm";
import UpdateProfile from "./pages/UpdateProfile";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <Router>
      <Toaster position="top-right" /> {/* Add this line */}
      <Layout>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/" element={<EmergencyPage />} />

          <Route path="/profile" element={<ProfileInfoPage />} />
          <Route path="/updateProfile" element={<UpdateProfile />} />
          <Route path="/addContacts" element={<AddContactForm />} />
        </Routes>
      </Layout>
    </Router>
  );
}
