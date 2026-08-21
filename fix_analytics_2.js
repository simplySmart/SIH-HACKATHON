import fs from 'fs';
const content = fs.readFileSync('src/components/AnalyticsDashboard.tsx', 'utf-8');
const newContent = content.replace(
  "import { Filter, Calendar, Activity, Database, AlertCircle, ShieldCheck } from 'lucide-react';",
  "import { Filter, Calendar, Activity, Database, AlertCircle, ShieldCheck, Flame, MapPin } from 'lucide-react';\nimport { MapContainer, TileLayer, Rectangle, Tooltip as LeafletTooltip, ZoomControl } from 'react-leaflet';\nimport 'leaflet/dist/leaflet.css';"
);
fs.writeFileSync('src/components/AnalyticsDashboard.tsx', newContent);
console.log("Updated imports.");
