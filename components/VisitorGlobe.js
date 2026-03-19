import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

const Globe = dynamic(() => import('react-globe.gl'), { ssr: false });

const MARKERS = [
  { lat: 9.082, lng: 8.6753, label: 'Nigeria (Home)', size: 1.5, color: '#10b981' },
  { lat: 6.5244, lng: 3.3792, label: 'Lagos', size: 1, color: '#10b981' },
  { lat: 37.7749, lng: -122.4194, label: 'San Francisco', size: 0.6, color: '#3b82f6' },
  { lat: 51.5074, lng: -0.1278, label: 'London', size: 0.6, color: '#3b82f6' },
  { lat: 35.6762, lng: 139.6503, label: 'Tokyo', size: 0.6, color: '#3b82f6' },
  { lat: 40.7128, lng: -74.006, label: 'New York', size: 0.6, color: '#3b82f6' },
  { lat: -1.2921, lng: 36.8219, label: 'Nairobi', size: 0.6, color: '#3b82f6' },
  { lat: 28.6139, lng: 77.209, label: 'Delhi', size: 0.5, color: '#3b82f6' },
  { lat: 52.52, lng: 13.405, label: 'Berlin', size: 0.5, color: '#3b82f6' },
  { lat: -33.8688, lng: 151.2093, label: 'Sydney', size: 0.5, color: '#3b82f6' },
  { lat: -23.5505, lng: -46.6333, label: 'São Paulo', size: 0.5, color: '#3b82f6' },
  { lat: 1.3521, lng: 103.8198, label: 'Singapore', size: 0.5, color: '#3b82f6' },
];

const ARCS = MARKERS.filter(m => m.label !== 'Nigeria (Home)' && m.label !== 'Lagos').map(m => ({
  startLat: 9.082,
  startLng: 8.6753,
  endLat: m.lat,
  endLng: m.lng,
  color: ['#10b98166', '#3b82f644'],
}));

export default function VisitorGlobe() {
  const globeRef = useRef();
  const containerRef = useRef();
  const [dimensions, setDimensions] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      setDimensions(containerRef.current.offsetWidth);
    }
    const onResize = () => {
      if (containerRef.current) setDimensions(containerRef.current.offsetWidth);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Configure controls once globe is mounted
  useEffect(() => {
    if (!globeRef.current || !dimensions) return;

    const interval = setInterval(() => {
      try {
        const controls = globeRef.current.controls();
        if (controls) {
          controls.autoRotate = true;
          controls.autoRotateSpeed = 1.5;
          controls.enableZoom = false;
          globeRef.current.pointOfView({ lat: 9, lng: 8, altitude: 2.5 }, 1000);
          clearInterval(interval);
        }
      } catch {
        // Globe not ready yet, retry
      }
    }, 300);

    return () => clearInterval(interval);
  }, [dimensions]);

  if (!dimensions) {
    return (
      <div ref={containerRef} className="w-full max-w-[400px] mx-auto aspect-square">
        <div className="w-full h-full flex items-center justify-center text-gray-500">
          <div className="animate-pulse">Loading globe...</div>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full max-w-[400px] mx-auto aspect-square overflow-hidden rounded-xl">
      <Globe
        ref={globeRef}
        width={dimensions}
        height={dimensions}
        backgroundColor="rgba(0,0,0,0)"
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        atmosphereColor="#10b981"
        atmosphereAltitude={0.15}
        pointsData={MARKERS}
        pointLat="lat"
        pointLng="lng"
        pointLabel="label"
        pointRadius="size"
        pointColor="color"
        pointAltitude={0.01}
        arcsData={ARCS}
        arcStartLat="startLat"
        arcStartLng="startLng"
        arcEndLat="endLat"
        arcEndLng="endLng"
        arcColor="color"
        arcDashLength={0.4}
        arcDashGap={0.2}
        arcDashAnimateTime={2000}
        arcStroke={0.5}
      />
    </div>
  );
}
