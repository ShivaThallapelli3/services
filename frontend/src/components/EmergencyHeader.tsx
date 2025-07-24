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
      // In your header component, update the fetchCity function:
    async function fetchCity() {
      try {
        setIsLoadingLocation(true);
        
        const url = `https://services-4zdo.onrender.com/api/location?lat=${lat}&lng=${lng}`;
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`API returned ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Backend API response:", data);
        
        // Now your backend returns { city: "Nizamabad", state: "Telangana", ... }
        if (data.city) {
          setCurrLocation(data.city);
        } else if (data.coordinates) {
          setCurrLocation(`${data.coordinates.lat.toFixed(2)}, ${data.coordinates.lng.toFixed(2)}`);
        } else {
          setCurrLocation("Location unavailable");
        }
        
      } catch (err) {
        console.error("City fetch error:", err);
        setCurrLocation("Location unavailable");
      } finally {
        setIsLoadingLocation(false);
      }
    }

    // async function fetchCity() {
    //   try {
    //     let url = `https://services-4zdo.onrender.com/api/location?lat=${lat}&lng=${lng}`;
    //     const response = await fetch(url);
    //     const data = await response.json();
    //     if (!response.ok) {
    //       console.error("Location fetch failed:", data.error);
    //     }
    //     // setCurrLocation(data.city || data.location ||  "Location unavailable");
    //     if (data.city) {
    //       setCurrLocation(data.city);
    //     } else if (data.location) {
    //       setCurrLocation(data.location);
    //     } else if (data.address && data.address.city) {
    //       setCurrLocation(data.address.city);
    //     }else{
    //     setCurrLocation("Location unavailable");
    //     }
    //   } catch (err) {
    //     console.error("City fetch error:", err);
    //     setCurrLocation("Location unavailable");
    //   }
    // }

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
        
     
      </div>
    </div>
  </div>
</header>
  );
};

export default EmergencyHeader;
