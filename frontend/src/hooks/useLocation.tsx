import { useEffect, useState } from "react";

export interface Location {
  lat: number;
  lng: number;
}

const useLocation = () => {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    const geoSuccess = (position: GeolocationPosition) => {
      setLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
      setError(null);
      console.log(
        "lat:",
        position.coords.latitude,
        "lng:",
        position.coords.longitude
      );
    };

    const geoError = (err: GeolocationPositionError) => {
      switch (err.code) {
        case err.PERMISSION_DENIED:
          setError("Location permission denied.");
          break;
        case err.POSITION_UNAVAILABLE:
          setError("Location unavailable (device could not get fix).");
          break;
        case err.TIMEOUT:
          setError("Location request timed out.");
          break;
        default:
          setError("Could not retrieve location.");
      }
    };

    navigator.geolocation.getCurrentPosition(geoSuccess, geoError, {
      enableHighAccuracy: true,
      maximumAge: 0, // ensures freshest possible fix
      timeout: 10000, // 10 seconds for a fix
    });
  }, []);

  return { location, error };
};

export default useLocation;
