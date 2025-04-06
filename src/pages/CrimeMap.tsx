import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet.heat';
import { ref, onValue } from 'firebase/database';
import { realtimeDb } from '../firebase/config';

const CrimeMap = () => {
  const [heatmapData, setHeatmapData] = useState<any[]>([]);

  useEffect(() => {
    const dbRef = ref(realtimeDb, 'crimes');
    onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const formatted = Object.values(data).map((report: any) => ({
          lat: parseFloat(report.coordinates?.lat),
          lon: parseFloat(report.coordinates?.lon),
          info: `Type: ${report.crimeType}<br/>Date: ${report.date}<br/>Time: ${report.time}`,
        }));
        setHeatmapData(formatted.filter((r) => !isNaN(r.lat) && !isNaN(r.lon)));
      }
    });
  }, []);

  return (
    <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '600px', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <HeatmapLayer points={heatmapData} />
    </MapContainer>
  );
};

const HeatmapLayer = ({ points }: { points: any[] }) => {
  const map = useMap();

  useEffect(() => {
    const heatLayer = (L as any).heatLayer(
      points.map((p) => [p.lat, p.lon, 0.8]),
      { radius: 25, blur: 15 }
    ).addTo(map);

    points.forEach((p) => {
      const marker = L.circleMarker([p.lat, p.lon], {
        radius: 8,
        color: 'red',
      }).bindPopup(p.info);
      marker.addTo(map);
    });

    return () => {
      map.eachLayer((layer) => {
        if ((layer as any)._leaflet_id && (layer as any)._latlng) {
          map.removeLayer(layer);
        }
      });
    };
  }, [points]);

  return null;
};

export default CrimeMap;