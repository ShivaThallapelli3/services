import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
const TrashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);
const ProfileInfoPage = () => {
  interface Profile {
    name: string;
    email: string;
    phone: string;
    contacts: Contacts[];
  }
  interface Contacts {
    _id: string;
    contact_name: string;
    contact_phone: string;
    contact_email: string;
  }
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await axios.get("https://services-4zdo.onrender.com/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
      } catch (err) {
        setError(
          (err.response && err.response.data && err.response.data.error) ||
            "Failed to load profile"
        );
      }
    }
    fetchProfile();
  }, [token, profile]);

  if (error)
    return <div className="mt-8 text-center text-red-500">{error}</div>;
  if (!profile) return <div className="mt-8 text-center">Loading...</div>;
  async function handleDeleteContact(_id) {
    // console.log("clicked");
    try {
      const res = await axios.delete(
        `https://services-4zdo.onrender.com/api/user/contact/delete/${_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Contact deleted successfully");
      console.log("Contact deleted:", res.data);
    } catch (err) {
      console.error(
        "Failed to delete contact:",
        err.response?.data || err.message
      );
      toast.error(
        "Failed to delete contact:",
        err.response?.data || err.message
      );
    }
  }
  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4"> 
  <div className="w-full max-w-lg mx-auto bg-white shadow-xl rounded-lg p-6 sm:p-8">
    {/* Header */}
    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">
      My Profile
    </h2>

    {/* Profile Details Section */}
    <div className="space-y-4 mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <span className="font-semibold text-gray-600">Name:</span>
        <span className="text-gray-800 mt-1 sm:mt-0">{profile.name}</span>
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <span className="font-semibold text-gray-600">Email:</span>
        <span className="text-gray-800 mt-1 sm:mt-0">{profile.email}</span>
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <span className="font-semibold text-gray-600">Phone:</span>
        <span className="text-gray-800 mt-1 sm:mt-0">{profile.phone}</span>
      </div>
    </div>

    {/* Divider */}
    <hr className="my-6 border-gray-200" />

    {/* Emergency Contacts Section */}
    <div>
      <h3 className="text-lg font-semibold text-gray-700 mb-4">
        My Emergency Contacts
      </h3>
      <ul className="space-y-3">
        {profile.contacts.length === 0 ? (
          <li className="text-gray-500 italic">No contacts added yet.</li>
        ) : (
          profile.contacts.map((c) => (
            <li 
              key={c._id} 
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-md hover:bg-gray-50 transition"
            >
              <div className="flex flex-col">
                <span className="font-medium text-gray-800">
                  {c.contact_name}
                </span>
                <span className="text-sm text-gray-500">
                  {c.contact_phone}
                  {c.contact_email && ` • ${c.contact_email}`}
                </span>
              </div>
              <button
                onClick={() => handleDeleteContact(c._id)}
                className="mt-2 sm:mt-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-100 rounded-full transition-colors"
                aria-label={`Delete ${c.contact_name}`}
              >
                <TrashIcon />
              </button>
            </li>
          ))
        )}
      </ul>
    </div>

    {/* Action Buttons */}
    <div className="mt-8 flex flex-col sm:flex-row gap-3">
      <button
        onClick={() => navigate("/addContacts")}
        className="w-full sm:w-auto flex-1 text-center bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition"
      >
        Add Contact
      </button>
      <button
        onClick={() => navigate("/updateProfile")}
        className="w-full sm:w-auto flex-1 text-center bg-white border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-md hover:bg-gray-100 transition"
      >
        Edit Profile
      </button>
    </div>
  </div>
</div>

  );
};

export default ProfileInfoPage;
