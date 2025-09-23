export type LatLng = { lat: number; lng: number; name?: string };
export const OAKLAND_CENTER: LatLng = { lat: 37.812, lng: -122.247 };
export const minutesFromKm = (dKm: number) => Math.round((dKm / 4.8) * 60);
export const haversineKm = (a: LatLng, b: LatLng) => {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h = Math.sin(dLat/2)**2 + Math.cos(lat1)*Math.cos(lat2)*Math.sin(dLon/2)**2;
  return 2 * R * Math.asin(Math.sqrt(h));
};
export const withinPilot = (p: LatLng) => {
  const in94610 = p.lat >= 37.796 && p.lat <= 37.823 && p.lng >= -122.261 && p.lng <= -122.231;
  const in94611 = p.lat >= 37.812 && p.lat <= 37.858 && p.lng >= -122.272 && p.lng <= -122.220;
  return in94610 || in94611;
};
