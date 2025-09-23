'use client';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LatLng } from '@/lib/utils';

const icon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25,41],
  iconAnchor: [12,41],
});

export function MapPanel({ from, to, points }: { from?: LatLng | null; to?: LatLng | null; points?: { lat:number; lng:number; name?:string }[] }) {
  const center = from || to || { lat: 37.812, lng: -122.247 };
  return (
    <div className="card">
      <div className="maph">
        <MapContainer center={[center.lat, center.lng]} zoom={14} style={{height:'100%', width:'100%'}} scrollWheelZoom>
          <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {from && <Marker position={[from.lat, from.lng]} icon={icon}><Popup>Pickup</Popup></Marker>}
          {to && <Marker position={[to.lat, to.lng]} icon={icon}><Popup>Destination</Popup></Marker>}
          {from && to && <Polyline positions={[[from.lat, from.lng], [to.lat, to.lng]]} />}
          {points?.map((p, i) => (
            <Marker key={i} position={[p.lat, p.lng]} icon={icon}><Popup>{p.name || 'Volunteer'}</Popup></Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
