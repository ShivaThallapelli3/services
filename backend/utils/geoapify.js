import axios from "axios";
import OpeningHours from "opening_hours";
import dotenv from "dotenv";
dotenv.config();

const GEOAPIFY_API_KEY = process.env.GEOAPIFY_API_KEY;
const GEOAPIFY_URL = "https://api.geoapify.com/v2/places";
const GEOAPIFYCURRLOC_URL = "https://api.geoapify.com/v1/geocode/reverse";

function getStatus(opening_hours) {
  if (!opening_hours) return "unknown";
  try {
    const oh = new OpeningHours(opening_hours);
    return oh.getState() ? "open" : "closed";
  } catch {
    return "unknown";
  }
}

function sortByStatus(places) {
  const statusOrder = { open: 0, unknown: 1, closed: 2 };
  // Omit closed, but you can change this as needed
  return places
    .sort((a, b) => statusOrder[a.status] - statusOrder[b.status])
    .filter((p) => p.status !== "closed");
}

export async function fetchServices({
  lat,
  lng,
  category,
  radius = 30000,
  limit = 20,
}) {
  const url = `${GEOAPIFY_URL}?categories=${category}&filter=circle:${lng},${lat},${radius}&limit=${limit}&apiKey=${GEOAPIFY_API_KEY}`;
  console.log("Geoapify request URL:", url);

  try {
    const { data } = await axios.get(url);
    return data.features.map((f) => {
      const opening_hours = f.properties.opening_hours || null;
      return {
        name: f.properties.name || "(No Name)",
        address: f.properties.address_line2 || f.properties.formatted,
        coordinates: [f.geometry.coordinates[0], f.geometry.coordinates[1]],
        status: getStatus(opening_hours),
        opening_hours,
        place_id: f.properties.place_id,
        phone: f.properties.phone,
        category: f.properties.categories,
      };
    });
  } catch (error) {
    // Log actual Geoapify error
    console.error(
      "Geoapify fetch error:",
      error.response?.data || error.message
    );
    throw error;
  }
}

async function fetchCurrLocation({ lat, lng }) {
  // Remove the type=city parameter to get full location data
  const url = `${GEOAPIFYCURRLOC_URL}?lat=${lat}&lon=${lng}&format=json&apiKey=${GEOAPIFY_API_KEY}`;
  
  console.log("🌍 Fetching location from:", url);
  
  try {
    const { data } = await axios.get(url, {
      timeout: 8000, // 8 second timeout
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'EmergencyServices/1.0'
      }
    });
    
    console.log("📍 Geoapify reverse geocoding response:", JSON.stringify(data, null, 2));
    
    // Check if we have valid response
    if (!data.features || data.features.length === 0) {
      throw new Error("No location data found in Geoapify response");
    }
    
    const feature = data.features[0];
    const props = feature.properties;
    
    // Extract location information with multiple fallbacks
    const locationData = {
      city: props.city || 
            props.town || 
            props.village || 
            props.state_district ||
            props.address_line1 ||
            null,
      state: props.state || props.region || null,
      country: props.country || null,
      formatted: props.formatted || null,
      postcode: props.postcode || null,
      full_address: props
    };
    
    console.log("🏙️  Extracted location data:", locationData);
    
    // Ensure we have at least a city name
    if (!locationData.city) {
      // Last resort: try to parse from formatted address
      if (locationData.formatted) {
        locationData.city = locationData.formatted.split(',')[0].trim();
      } else {
        throw new Error("Unable to determine city from location data");
      }
    }
    
    return locationData;
    
  } catch (error) {
    console.error("❌ Geoapify reverse geocoding error:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      coordinates: { lat, lng }
    });
    
    // Re-throw with more context
    throw new Error(`Location fetch failed: ${error.message}`);
  }
}
export { sortByStatus, fetchCurrLocation };
