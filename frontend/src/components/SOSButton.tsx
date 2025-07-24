import React from "react";
import { AlertTriangle } from "lucide-react";
import useLocation from "../hooks/useLocation";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SOSButton = () => {
  const { location } = useLocation();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const handleClick = async () => {
    if (!token) {
      navigate("/login");
    }

    if (!location) {
      alert("Location not available!");
      return;
    }

    try {
      await axios.post(
        "https://services-4zdo.onrender.com/api/user/sos",
        {
          lat: location.lat,
          lng: location.lng,
          
          message: "SOS Emergency! Please help me.",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("SOS Alert sent to your emergency contacts!");
    } catch (e) {
      alert(
        e.response?.data?.error ||
          "Failed to send SOS alert. Please try again later or Login to send alert."
      );
    }
  };

  return (
    
<div className="text-center mt-8 sm:mt-12 md:mt-16 px-4 sm:px-0">
  <button
    onClick={handleClick}
    className="bg-red-500 hover:bg-red-600 active:bg-red-700 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-full shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-200 inline-flex items-center justify-center w-full sm:w-auto max-w-xs sm:max-w-none mx-auto touch-manipulation"
  >
    <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 mr-2 flex-shrink-0" />
    <span className="whitespace-nowrap">SOS EMERGENCY</span>
  </button>
  <p className="text-xs sm:text-sm text-gray-500 mt-2 px-2 sm:px-0 max-w-sm sm:max-w-none mx-auto">
    Tap to alert emergency contacts with your location
  </p>
</div>
  );
};

export default SOSButton;
