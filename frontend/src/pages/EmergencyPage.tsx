import React, { useState, useEffect } from "react";
import SOSButton from "../components/SOSButton";
import ServiceFilters from "../components/ServiceFilters";
import ServiceGrid from "../components/ServiceGrid";
import useLocation from "../hooks/useLocation";

type ServiceStatus = "open" | "unknown";
interface Service {
  name: string;
  address: string;
  coordinates: [number, number];
  status: ServiceStatus;
  opening_hours?: string;
  place_id?: string;
  phone?: string;
  category?: string[];
}

type FilterType = "all" | "hospital" | "fire" | "police";

export default function EmergencyPage() {
  const [filter, setFilter] = useState<FilterType>("all");
  const [services, setServices] = useState<Service[]>([]);
  const { location, error } = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Safely check location before proceeding
    if (!location) {
      setServices([]);
      return;
    }

    // When we get here, location is guaranteed present.
    const { lat, lng } = location;

    async function fetchServices() {
      setLoading(true);
      let url = `https://services-4zdo.onrender.com/api/services/nearby?lat=${lat}&lng=${lng}`;
      if (filter !== "all") url += `&type=${filter}`;
      try {
        const response = await fetch(url);
        const data = await response.json();

        let fetchedServices: Service[] = [];
        if (filter === "all") {
          fetchedServices = [
            ...(data.hospitals || []),
            ...(data.policeStations || []),
            ...(data.fireStations || []),
          ];
        } else {
          const key =
            filter === "hospital"
              ? "hospitals"
              : filter === "fire"
              ? "fireStations"
              : "policeStations";
          fetchedServices = data[key] || [];
        }
        setServices(fetchedServices);
      } catch (e) {
        setServices([]);
      }
      setLoading(false);
    }

    fetchServices();
  }, [location, filter]);

  return (
    <div className="min-h-screen bg-gray-50 pb-4 sm:pb-6">
  <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
    {/* SOS Button Section */}
    <div className="pt-4 sm:pt-6 pb-6 sm:pb-8">
      <SOSButton />
    </div>

    {/* Service Filters */}
    <div className="mb-4 sm:mb-6">
      <ServiceFilters
        selectedType={filter}
        onFilterChange={(t: string) => setFilter(t as FilterType)}
      />
    </div>

    {/* Main Content Area */}
    <div className="min-h-[200px] sm:min-h-[300px]">
      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 sm:p-4 rounded-lg text-center text-sm sm:text-base mx-2 sm:mx-0">
          <div className="font-medium mb-1">Error</div>
          <div>{error}</div>
        </div>
      ) : !location ? (
        <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-500 mb-4"></div>
          <div className="text-gray-600 text-sm sm:text-base">
            Getting your location...
          </div>
          <div className="text-gray-400 text-xs sm:text-sm mt-2 max-w-sm px-4">
            Please allow location access to find nearby emergency services
          </div>
        </div>
      ) : loading ? (
        <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center">
          <div className="animate-pulse flex space-x-1 mb-4">
            <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
          <div className="text-gray-600 text-sm sm:text-base">
            Loading nearby services...
          </div>
          <div className="text-gray-400 text-xs sm:text-sm mt-2">
            Finding emergency services in your area
          </div>
        </div>
      ) : services.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center">
          <div className="bg-gray-100 rounded-full p-4 sm:p-6 mb-4">
            <svg className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div className="text-gray-600 text-sm sm:text-base font-medium mb-2">
            No nearby services found
          </div>
          <div className="text-gray-400 text-xs sm:text-sm max-w-sm px-4">
            Try expanding your search area or check your location settings
          </div>
        </div>
      ) : (
        <div className="fade-in">
          <ServiceGrid
            services={services}
            onCall={(phone, name) => !!phone && window.open(`tel:${phone}`)}
            onDirections={(coords, name) =>
              window.open(
                `https://www.google.com/maps/dir/?api=1&destination=${coords[1]},${coords[0]}`,
                "_blank"
              )
            }
          />
        </div>
      )}
    </div>
  </div>

  
</div>
  );
}
