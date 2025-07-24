import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddContactForm = () => {
  const [form, setForm] = useState({
    contact_name: "",
    contact_phone: "",
    contact_email: "",
  });
  interface Contact {
    _id: string;
    contact_name: string;
    contact_email: string;
    contact_phone: string;
  }
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchContacts();
  }, []);

  async function fetchContacts() {
    try {
      const res = await axios.get("https://services-4zdo.onrender.com/api/contacts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setContacts(res.data);
    } catch (err) {
      setError("Failed to load contacts");
    }
  }

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await axios.post("https://services-4zdo.onrender.com/api/contacts", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Contact added successfully!");
      setForm({ contact_name: "", contact_phone: "", contact_email: "" });
      fetchContacts();
      toast.success("Contact added successfully!");
      navigate("/profile");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add contact");
      toast.error(err.response?.data?.error || "Failed to add contact");
    }
  };

  return (
    <div className="max-w-md mx-auto p-3 sm:p-4 border rounded-lg shadow-sm bg-white">
  <h2 className="text-lg sm:text-xl mb-3 sm:mb-4 font-semibold text-gray-900">
    Emergency Contacts
  </h2>

  <form onSubmit={handleSubmit} className="space-y-3 mb-4 sm:mb-6">
    <input
      name="contact_name"
      value={form.contact_name}
      onChange={handleChange}
      placeholder="Contact Name"
      required
      className="block w-full border border-gray-300 px-3 py-2 sm:py-2.5 rounded-md text-sm sm:text-base focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
    />
    <input
      name="contact_phone"
      value={form.contact_phone}
      onChange={handleChange}
      placeholder="Contact Phone"
      type="tel"
      required
      className="block w-full border border-gray-300 px-3 py-2 sm:py-2.5 rounded-md text-sm sm:text-base focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
    />
    <input
      name="contact_email"
      value={form.contact_email}
      onChange={handleChange}
      placeholder="Contact Email (Required)"
      type="email"
      className="block w-full border border-gray-300 px-3 py-2 sm:py-2.5 rounded-md text-sm sm:text-base focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
      required
    />
    <button
      type="submit"
      className="w-full bg-red-500 hover:bg-red-600 active:bg-red-700 text-white py-2.5 sm:py-3 px-4 rounded-md font-medium text-sm sm:text-base transition-colors touch-manipulation shadow-sm hover:shadow-md"
    >
      Add Contact
    </button>
  </form>

  {message && (
    <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-md mb-3 sm:mb-4 text-sm">
      {message}
    </div>
  )}
  
  {error && (
    <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md mb-3 sm:mb-4 text-sm">
      {error}
    </div>
  )}

  <div className="border-t pt-3 sm:pt-4">
    <h3 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base text-gray-900">
      Existing Contacts
    </h3>
    
    {contacts.length === 0 ? (
      <p className="text-gray-500 text-sm italic">No contacts added yet</p>
    ) : (
      <div className="space-y-2">
        {contacts.map((c) => (
          <div
            key={c._id}
            className="bg-gray-50 p-2 sm:p-3 rounded-md border border-gray-200"
          >
            <div className="font-medium text-sm sm:text-base text-gray-900 mb-1">
              {c.contact_name}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">
              <div className="flex items-center mb-1">
                <span className="font-medium mr-1">Phone:</span>
                <a 
                  href={`tel:${c.contact_phone}`}
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  {c.contact_phone}
                </a>
              </div>
              {c.contact_email && (
                <div className="flex items-center">
                  <span className="font-medium mr-1">Email:</span>
                  <a 
                    href={`mailto:${c.contact_email}`}
                    className="text-blue-600 hover:text-blue-800 underline break-all"
                  >
                    {c.contact_email}
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
</div>
  );
};

export default AddContactForm;
