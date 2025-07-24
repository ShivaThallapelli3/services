import { fetchCurrLocation } from "../utils/geoapify.js";

export async function getCurrLocation(req, res) {
  const { lat, lng } = req.query;
  console.log("Curr Location : LAT: ", lat, "  LNG : ", lng);

  if (lat == undefined || lng == undefined) {
    console.log("Missing lat/lng");
    return res.status(400).json({ error: "Missing lat/lng" });
  }
  const latNum = parseFloat(lat);
  const lngNum = parseFloat(lng);
  if (Number.isNaN(latNum) || Number.isNaN(lngNum)) {
    console.log("Invalid lat/lng");
    return res.status(400).json({ error: "Invalid lat/lng" });
  }

  try {
    const city = await fetchCurrLocation({ lat: latNum, lng: lngNum });
    if (!city) {
      return res.status(404).json({ error: "City not found" });
    }
    return res.json({ city });
  } catch (error) {
    console.error("Backend error in getCurrLocation:", error);
    return res.status(500).json({ error: "Location error" });
  }
}
