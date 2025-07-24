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
  const url = `${GEOAPIFYCURRLOC_URL}?lat=${lat}&lon=${lng}&type=city&apiKey=${GEOAPIFY_API_KEY}`;
  try {
    const { data } = await axios.get(url);
    console.log("Geoapify reverse data:", data);
    if (
      data.features &&
      data.features[0] &&
      data.features[0].properties &&
      data.features[0].properties.city
    ) {
      return data.features[0].properties.city;
    } else {
      throw new Error("City not found in Geoapify response");
    }
  } catch (error) {
    console.error(
      "Geoapify fetch error:",
      error.response?.data || error.message
    );
    throw error;
  }
}
export { sortByStatus, fetchCurrLocation };
