 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/MapPanel.tsx b/MapPanel.tsx
index 78d5a9f6c2b2204e6e542ee55a91a04872795f2a..fc19ed57b3ad44c46e68ec7f433e9f8e80c2bbd2 100644
--- a/MapPanel.tsx
+++ b/MapPanel.tsx
@@ -1,31 +1,50 @@
 'use client';
-import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
+import type { ComponentType } from 'react';
+import {
+  MapContainer as LeafletMapContainer,
+  TileLayer as LeafletTileLayer,
+  Marker as LeafletMarker,
+  Popup as LeafletPopup,
+  Polyline as LeafletPolyline,
+} from 'react-leaflet';
 import L from 'leaflet';
 import 'leaflet/dist/leaflet.css';
-import { LatLng } from '@/lib/utils';
+import { LatLng } from '@/utils';
+
+const MapContainer = LeafletMapContainer as unknown as ComponentType<any>;
+const TileLayer = LeafletTileLayer as unknown as ComponentType<any>;
+const Marker = LeafletMarker as unknown as ComponentType<any>;
+const Popup = LeafletPopup as unknown as ComponentType<any>;
+const Polyline = LeafletPolyline as unknown as ComponentType<any>;
 
 const icon = new L.Icon({
   iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
   shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
   iconSize: [25,41],
   iconAnchor: [12,41],
 });
 
-export function MapPanel({ from, to, points }: { from?: LatLng | null; to?: LatLng | null; points?: { lat:number; lng:number; name?:string }[] }) {
+export type MapPanelProps = {
+  from?: LatLng | null;
+  to?: LatLng | null;
+  points?: { lat:number; lng:number; name?:string }[];
+};
+
+export function MapPanel({ from, to, points }: MapPanelProps) {
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
 
EOF
)