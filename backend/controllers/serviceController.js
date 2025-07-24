import { fetchServices, sortByStatus } from "../utils/geoapify.js";

const categories = {
  hospital: "healthcare.hospital",
  police: "service.police",
  fire: "service.fire_station",
};

export async function getNearbyServices(req, res) {
  const { lat, lng, type, radius } = req.query;
  console.log("Incoming request params:", req.query);

  // Validate presence
  if (lat === undefined || lng === undefined) {
    return res.status(400).json({ error: "Missing lat/lng" });
  }

  // Validate number
  const latNum = parseFloat(lat);
  const lngNum = parseFloat(lng);
  if (Number.isNaN(latNum) || Number.isNaN(lngNum)) {
    return res.status(400).json({ error: "Invalid lat/lng" });
  }

  try {
    if (type && ["hospital", "police", "fire"].includes(type)) {
      const singleTypeKey =
        type === "hospital"
          ? "hospitals"
          : type === "police"
          ? "policeStations"
          : "fireStations";
      const result = await fetchServices({
        lat: latNum,
        lng: lngNum,
        category: categories[type],
        radius,
      });
      return res.json({ [singleTypeKey]: sortByStatus(result) });
    }

    // All types: hospitals, police, fire
    const [hospitals, policeStations, fireStations] = await Promise.all([
      fetchServices({
        lat: latNum,
        lng: lngNum,
        category: categories.hospital,
        radius,
      }),
      fetchServices({
        lat: latNum,
        lng: lngNum,
        category: categories.police,
        radius,
      }),
      fetchServices({
        lat: latNum,
        lng: lngNum,
        category: categories.fire,
        radius,
      }),
    ]);
    res.json({
      hospitals: sortByStatus(hospitals),
      policeStations: sortByStatus(policeStations),
      fireStations: sortByStatus(fireStations),
    });
  } catch (e) {
    console.error("Controller error:", e.response?.data || e.message || e);
    res.status(500).json({ error: "Failed to fetch from Geoapify" });
  }
}
