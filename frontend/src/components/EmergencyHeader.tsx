import React, { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useLocation as useRouterLocation,
} from "react-router-dom";
import { MapPin } from "lucide-react";
import useLocation from "../hooks/useLocation"; // this is your *geolocation* hook
import toast from "react-hot-toast";

const EmergencyHeader = () => {
  const { location, error } = useLocation(); // geo
  const [currLocation, setCurrLocation] = useState("");
  const [user, setUser] = useState<{ name: string } | null>(null);
  const navigate = useNavigate();
  const routerLocation = useRouterLocation(); // router's URL
  // Get user state from localStorage on URL changes
  useEffect(() => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("user_name");
    if (token && name) {
      setUser({ name });
    } else {
      setUser(null);
    }
  }, [routerLocation.pathname]);

  // Geo location → City
  useEffect(() => {
    if (!location) {
      setCurrLocation("Location unavailable");
      return;
    }
    const lat = location.lat;
    const lng = location.lng;

    async function fetchCity() {
      try {
        let url = `http://localhost:5000/api/location?lat=${lat}&lng=${lng}`;
        const response = await fetch(url);
        const data = await response.json();
        if (!response.ok) {
          console.error("Location fetch failed:", data.error);
        }
        setCurrLocation(data.city || "Location unavailable");
      } catch (err) {
        console.error("City fetch error:", err);
        setCurrLocation("Location unavailable");
      }
    }

    fetchCity();
  }, [location]);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_name");
    setUser(null);
    toast.success("Logout successfully");
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-sm border-b">
  <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
    <div className="flex items-center justify-between h-14 sm:h-16">
      {/* Left section: location indicator */}
      <div className="flex items-center min-w-0 flex-1">
        <div className="bg-red-500 rounded-full p-1.5 sm:p-2 mr-2 sm:mr-3 flex-shrink-0">
          <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <button
            className="text-lg sm:text-xl font-semibold text-gray-900 bg-transparent border-none p-0 m-0 cursor-pointer truncate block w-full text-left"
            style={{ outline: "none" }}
            type="button"
            aria-label="Emergency Services"
            onClick={() => {
              navigate("/");
            }}
          >
            Emergency Services
          </button>
          <p className="text-xs sm:text-sm text-gray-500 flex items-center truncate">
            <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
            <span className="truncate">{currLocation}</span>
          </p>
        </div>
      </div>

      {/* Right section: auth and settings */}
      <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0 ml-2">
        {user ? (
          <>
            <span
              className="font-medium text-gray-700 hover:underline cursor-pointer text-sm sm:text-base truncate max-w-20 sm:max-w-none"
              onClick={() => navigate("/profile")}
            >
              <button className="truncate">{user.name}</button>
            </span>
            <button
              onClick={handleLogout}
              className="text-xs sm:text-sm text-red-500 hover:underline whitespace-nowrap"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-xs sm:text-sm text-blue-600 hover:underline whitespace-nowrap"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="text-xs sm:text-sm text-green-600 hover:underline whitespace-nowrap"
            >
              Sign Up
            </Link>
          </>
        )}
        
        {/* Settings button */}
        <button
          className="p-1.5 sm:p-2 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-500 flex-shrink-0"
          aria-label="Settings"
        >
          <svg
            className="h-5 w-5 sm:h-6 sm:w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a.995.995 0 01.564.656 2.184 2.184 0 00.622 1.004 2.6 2.6 0 001.422.74c1.367.248 2.415 1.382 2.415 2.77 0 .29-.04.566-.114.825a.975.975 0 00.51.762c.477.271.914.642 1.287 1.086a2.222 2.222 0 01-.153 2.893 2.2 2.2 0 01-3.075.165 3.686 3.686 0 00-2.137-.698 3.563 3.563 0 00-2.604 1.1c-.376.396-.628.899-.72 1.441a1.43 1.43 0 01-1.225 1.196 2.197 2.197 0 01-1.965-2.94 3.719 3.719 0 01.344-1.021 3.677 3.677 0 00-1.015-4.686 3.613 3.613 0 00-4.799.216 3.48 3.48 0 01-.187 4.927 2.116 2.116 0 01-1.93.66c-.796-.144-1.442-.85-1.47-1.65a3.704 3.704 0 011.01-3.018c.128-.152.233-.327.304-.523a10.917 10.917 0 010-2.44 3.554 3.554 0 01.445-1.423 3.546 3.546 0 014.025-1.528c.257.08.5.2.715.356.34.273.578.63.69 1.026a1.585 1.585 0 001.073 1.205z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</header>
  );
};

export default EmergencyHeader;
