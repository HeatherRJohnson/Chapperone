'use client';
import { useMemo, useState } from 'react';
import MapPanel from '../MapPanel';
import useLocalStore from '../useLocalStore';
import { haversineKm, minutesFromKm, OAKLAND_CENTER, withinPilot, LatLng } from '../utils';

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
    <div className="row">
      <div className="card">
        <h2>Set your walk</h2>
        <div style={{display:'grid', gap:12}}>
          <div>
            <label>Pickup</label>
            <div style={{display:'flex', gap:8}}>
              <button className="btn secondary" onClick={()=>navigator.geolocation?.getCurrentPosition(p=>setFrom({ lat:p.coords.latitude, lng:p.coords.longitude, name:'My location' }))}>Use my location</button>
              <button className="btn secondary" onClick={()=>setFrom(OAKLAND_CENTER)}>Use Oakland center (demo)</button>
            </div>
          </div>
          <div>
            <label>Destination</label>
            <div style={{display:'flex', gap:8}}>
              <button className="btn secondary" onClick={()=>setTo({ lat:37.8082, lng:-122.2462, name:'Lake Merritt Pergola' })}>Lake Merritt Pergola</button>
              <button className="btn secondary" onClick={()=>setTo({ lat:37.8254, lng:-122.2532, name:'Piedmont Ave & 41st' })}>Piedmont Ave & 41st</button>
            </div>
          </div>
          <div style={{display:'flex', alignItems:'center', gap:12}}>
            <label>When</label>
            <select value={when} onChange={(e)=>setWhen(e.target.value as any)}>
              <option value="now">Now</option>
              <option value="schedule">Schedule</option>
            </select>
            {when==='schedule' && <input type="datetime-local" value={scheduleAt} onChange={e=>setScheduleAt(e.target.value)} />}
          </div>

          {etaMins!=null && (
            <div className="card" style={{background:'#101016'}}>
              <div><b>Estimated walking time:</b> ~{etaMins} min</div>
              <small>{withinCap ? 'Within the 20-minute pilot cap.' : 'Over the 20-minute cap. Choose a closer destination.'}</small>
            </div>
          )}

          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <small>Pilot area pickup required: 94610 or 94611 (Oakland)</small>
            <button className="btn" disabled={!canRequest} onClick={()=>document.getElementById('match')?.scrollIntoView({behavior:'smooth'})}>Find a chaperone</button>
          </div>
        </div>

        <div id="match" style={{marginTop:16}}>
          <h3>Available chaperones (ranked)</h3>
          <div className="list">
            {ranked.length===0 && <small>Set a pickup to see nearby volunteers.</small>}
            {ranked.map(({c, distKm}) => (
              <div key={c.id} className="card" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <div>
                  <div><b>{c.name}</b></div>
                  <small>{c.safeWalks} safe walks • Member since {c.memberSince}</small>
                </div>
                <div style={{display:'flex', gap:8, alignItems:'center'}}>
                  <span className="badge">~{Math.round(distKm*1000)} m away</span>
                  <button className="btn" onClick={()=>alert('Demo: chaperone selected! (Matching will be live when Supabase is connected)')}>Choose</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <MapPanel from={from||undefined} to={to||undefined} points={SAMPLE_CHAPS} />
    </div>
  );
}

function Chaperone() {
  const [online, setOnline] = useLocalStore<boolean>('chap_online', false);
  const [lat, setLat] = useLocalStore<number>('chap_lat', OAKLAND_CENTER.lat);
  const [lng, setLng] = useLocalStore<number>('chap_lng', OAKLAND_CENTER.lng);
  const [about, setAbout] = useLocalStore<string>('chap_about', '');

  return (
    <div className="row">
      <div className="card">
        <h2>Chaperone profile</h2>
        <div className="row">
          <div>
            <label>About (200 chars)</label>
            <textarea maxLength={200} value={about} onChange={e=>setAbout(e.target.value)} placeholder="Neighborhood volunteer. I usually walk mornings and early evenings." />
            <small>{200 - about.length} remaining</small>
          </div>
          <div>
            <label>Status</label>
            <div style={{display:'flex', gap:8}}>
              <button className="btn" onClick={()=>setOnline(true as any)}>Go Online</button>
              <button className="btn secondary" onClick={()=>setOnline(false as any)}>Go Offline</button>
            </div>
            <small>Online chaperones may receive requests (within pilot area).</small>
          </div>
        </div>
        <div style={{marginTop:12}}>
          <button className="btn secondary" onClick={()=>navigator.geolocation?.getCurrentPosition(p=>{ setLat(p.coords.latitude); setLng(p.coords.longitude); })}>Use my current location</button>
        </div>
      </div>

      <MapPanel from={{lat, lng, name:'You'}} to={undefined} points={[]} />
    </div>
  );
}
