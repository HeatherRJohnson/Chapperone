 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/app/page.tsx b/app/page.tsx
index b2c8b07b0ecf3e38f37ba122466c1f7696b27f39..f2a27fe907864b14a0801f824a8e2ca708c7e45c 100644
--- a/app/page.tsx
+++ b/app/page.tsx
@@ -1,31 +1,41 @@
 'use client';
-import { useMemo, useState } from 'react';
-import MapPanel from '../MapPanel';
-import useLocalStore from '../useLocalStore';
+import { useMemo, useState, type ComponentType } from 'react';
+import dynamic from 'next/dynamic';
+import type { MapPanelProps } from '../MapPanel';
+import { useLocalStore } from '../useLocalStore';
 import { haversineKm, minutesFromKm, OAKLAND_CENTER, withinPilot, LatLng } from '../utils';
 
+const MapPanel = dynamic(() => import('../MapPanel').then(mod => mod.MapPanel), {
+  ssr: false,
+  loading: () => (
+    <div className="card">
+      <div className="maph" />
+    </div>
+  ),
+}) as ComponentType<MapPanelProps>;
+
 type Chap = { id: string; name: string; lat: number; lng: number; safeWalks: number; memberSince: string; online: boolean };
 const SAMPLE_CHAPS: Chap[] = [
   { id:'c1', name:'Amina Chen', lat:37.8129, lng:-122.2473, safeWalks:42, memberSince:'Mar 2024', online:true },
   { id:'c2', name:'Luis Ortega', lat:37.8260, lng:-122.2520, safeWalks:118, memberSince:'Aug 2023', online:true },
   { id:'c3', name:'Priya Patel', lat:37.8090, lng:-122.2410, safeWalks:19, memberSince:'Jan 2025', online:true }
 ];
 
 export default function Page() {
   const [role, setRole] = useLocalStore<'walker'|'chaperone'>('role', 'walker');
   return (
     <div>
       <header className="header">
         <div className="container" style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 16px'}}>
           <div className="brand">
             <div className="title">ChAPPerone</div>
             <small>You don&apos;t have to walk alone</small>
           </div>
           <div className="tabs">
             <div className={['tab', role==='walker'?'active':''].join(' ')} onClick={()=>setRole('walker')}>Walker</div>
             <div className={['tab', role==='chaperone'?'active':''].join(' ')} onClick={()=>setRole('chaperone')}>Chaperone</div>
           </div>
         </div>
       </header>
 
       <main className="container" style={{paddingTop:16}}>
 
EOF
)