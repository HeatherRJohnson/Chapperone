'use client';
import { useMemo, useState, type ComponentType } from 'react';
import dynamic from 'next/dynamic';
import type { MapPanelProps } from '../MapPanel';
import { useLocalStore } from '../useLocalStore';
import { haversineKm, minutesFromKm, OAKLAND_CENTER, withinPilot, LatLng } from '../utils';

const MapPanel = dynamic(() => import('../MapPanel').then(mod => mod.MapPanel), {
  ssr: false,
  loading: () => (
    <div className="card">
      <div className="maph" />
    </div>
  ),
}) as ComponentType<MapPanelProps>;

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
        {role==='walker' ? <Walker /> : <Chaperone />}
      </main>

      <footer className="container" style={{paddingBottom:24}}>
        <small>Pilot: 94610 & 94611 (Oakland). Volunteer service; cash tips optional; walking only; volunteers don&apos;t handle valuables. In emergencies, call local emergency services.</small>
      </footer>
    </div>
  );
}

function Walker() {
  const [from, setFrom] = useState<LatLng | null>(null);
  const [to, setTo] = useState<LatLng | null>(null);
  const [when, setWhen] = useState<'now'|'schedule'>('now');
  const [scheduleAt, setScheduleAt] = useState<string>('');

  const etaMins = useMemo(()=> (from&&to) ? minutesFromKm(haversineKm(from, to)) : null, [from, to]);
  const withinCap = etaMins == null ? true : etaMins <= (20);
  const canRequest = !!(from && to && withinPilot(from) && withinCap);

  const ranked = useMemo(()=> {
    if (!from) return [];
    return SAMPLE_CHAPS
      .filter(c=>c.online)
      .map(c=>({ c, distKm: haversineKm(from, { lat:c.lat, lng:c.lng }) }))
      .sort((a,b)=> (a.distKm - b.distKm));
  }, [from]);

  return (
    <div
