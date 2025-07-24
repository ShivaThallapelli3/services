import { fetchCurrLocation } from "../utils/geoapify.js";

export async function getCurrLocation(req, res) {
  const { lat, lng } = req.query;
  console.log("Curr Location : LAT:", lat, "LNG:", lng);

  // Improved validation
  if (!lat || !lng) {
    console.log("Missing lat/lng parameters");
    return res.status(400).json({ error: "Missing lat/lng parameters" });
  }

  const latNum = parseFloat(lat);
  const lngNum = parseFloat(lng);
  
  if (Number.isNaN(latNum) || Number.isNaN(lngNum)) {
    console.log("Invalid lat/lng values");
    return res.status(400).json({ error: "Invalid lat/lng values" });
  }

  // Validate coordinate ranges
  if (latNum < -90 || latNum > 90 || lngNum < -180 || lngNum > 180) {
    console.log("Coordinates out of valid range");
    return res.status(400).json({ error: "Coordinates out of valid range" });
  }

  try {
    const locationData = await fetchCurrLocation({ lat: latNum, lng: lngNum });
    
    if (!locationData || !locationData.city) {
      console.log("No city found for coordinates:", { lat: latNum, lng: lngNum });
      return res.status(404).json({ 
        error: "City not found",
        coordinates: `${latNum}, ${lngNum}` 
      });
    }

    // Return comprehensive location data
    return res.json({
      city: locationData.city,
      state: locationData.state,
      country: locationData.country,
      formatted: locationData.formatted,
      coordinates: { lat: latNum, lng: lngNum }
    });

  } catch (error) {
    console.error("Backend error in getCurrLocation:", error.message);
    return res.status(500).json({ 
      error: "Unable to fetch location",
      details: error.message 
    });
  }
}
