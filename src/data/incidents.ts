import { FireIncident } from '../types';

export const mockIncidents: FireIncident[] = [
  {
    id: 'ALRT-KNK-2026-0519-001',
    status: 'responding',
    severity: 'critical',
    title: 'Fire Detected',
    location: {
      state: 'Chhattisgarh',
      district: 'Kanker Forest',
      forestDivision: 'North Kanker',
      range: 'Zone 12B',
      beat: 'Beat 3',
      coordinates: { lat: 20.2721, lng: 81.4931 }
    },
    detection: {
      method: 'combined',
      confidence: 96,
      time: '2026-05-19T10:28:00Z'
    },
    risk: { level: 'High', score: 90 },
    environment: { temperature: 312, humidity: 18, windSpeed: 14, windDirection: 'SW' },
    impact: { areaAffectedHa: 2450 },
    response: {
      teamAssigned: 'Alpha Rapid Response',
      personnel: 12,
      distanceKm: 4.2,
      etaMins: 15,
      nearestWater: 'Lake Kanker (2km)',
      nearestRoad: 'NH-30 (1km)',
      actionsTaken: ['Notify nearest forest officials', 'Deploy ground patrol team', 'Prepare fire response equipment', 'Update situation in 30 mins']
    },
    history: [
      { id: 'h1', timestamp: '10:05 AM', description: 'Fire detected by satellite', type: 'detection' },
      { id: 'h2', timestamp: '10:06 AM', description: 'IoT sensors confirmed', type: 'verification' },
      { id: 'h3', timestamp: '10:07 AM', description: 'Alert sent to officials', type: 'notification' },
      { id: 'h4', timestamp: '10:08 AM', description: 'Ground team notified', type: 'response' }
    ],
    evidence: {
      images: ['https://images.unsplash.com/photo-1595955613309-8d1dc573b0a7?auto=format&fit=crop&q=80&w=1200'],
      video: 'https://example.com/video.mp4',
      sources: {
        satellite: 98,
        iot: 91,
        camera: 88,
        weather: 94
      }
    }
  },
  {
    id: 'ALRT-BSR-2026-0519-002',
    status: 'responding',
    severity: 'high',
    title: 'Fire Detected',
    location: {
      state: 'Chhattisgarh',
      district: 'Bastar Forest',
      forestDivision: 'Jagdalpur',
      range: 'Zone 7A',
      beat: 'Beat 1',
      coordinates: { lat: 19.0759, lng: 82.0289 }
    },
    detection: { method: 'satellite', confidence: 89, time: '2026-05-19T10:15:00Z' },
    risk: { level: 'High', score: 85 },
    environment: { temperature: 42, humidity: 20, windSpeed: 10, windDirection: 'S' },
    impact: { areaAffectedHa: 800 },
    response: { 
      teamAssigned: 'Bravo Ground Patrol',
      personnel: 6,
      distanceKm: 12.5,
      etaMins: 35,
      nearestWater: 'Indravati River (5km)',
      nearestRoad: 'State Highway 9 (3km)',
      actionsTaken: ['Notify nearest forest officials'] 
    },
    history: [
      { id: 'h1_2', timestamp: '10:15 AM', description: 'Fire detected by satellite', type: 'detection' },
      { id: 'h2_2', timestamp: '10:20 AM', description: 'Ground team dispatched', type: 'response' }
    ],
    evidence: { 
      images: [],
      sources: { satellite: 89, weather: 80 }
    }
  },
  {
    id: 'ALRT-SRG-2026-0519-003',
    status: 'verifying',
    severity: 'moderate',
    title: 'Smoke Detected',
    location: {
      state: 'Chhattisgarh',
      district: 'Surguja Forest',
      forestDivision: 'Ambikapur',
      range: 'Zone 3C',
      beat: 'Beat 5',
      coordinates: { lat: 23.1189, lng: 83.1950 }
    },
    detection: { method: 'sensor', confidence: 75, time: '2026-05-19T09:58:00Z' },
    risk: { level: 'Moderate', score: 55 },
    environment: { temperature: 38, humidity: 25, windSpeed: 8, windDirection: 'SE' },
    impact: { areaAffectedHa: 0 },
    response: { 
      actionsTaken: [] 
    },
    history: [
      { id: 'h1_3', timestamp: '09:58 AM', description: 'Smoke anomaly detected by IoT', type: 'detection' }
    ],
    evidence: { 
      images: [],
      sources: { iot: 75, weather: 60 }
    }
  },
  {
    id: 'ALRT-RPR-2026-0519-004',
    status: 'extinguished',
    severity: 'low',
    title: 'False Alarm',
    location: {
      state: 'Chhattisgarh',
      district: 'Raipur Forest',
      forestDivision: 'Raipur',
      range: 'Zone 1D',
      beat: 'Beat 2',
      coordinates: { lat: 21.2514, lng: 81.6296 }
    },
    detection: { method: 'sensor', confidence: 30, time: '2026-05-19T09:20:00Z' },
    risk: { level: 'Low', score: 10 },
    environment: { temperature: 35, humidity: 30, windSpeed: 5, windDirection: 'N' },
    impact: { areaAffectedHa: 0 },
    response: { actionsTaken: [] },
    history: [
      { id: 'h1_4', timestamp: '09:20 AM', description: 'Sensor anomaly', type: 'detection' },
      { id: 'h2_4', timestamp: '09:45 AM', description: 'Marked as false alarm', type: 'verification' }
    ],
    evidence: { 
      images: [],
      sources: { iot: 30 }
    }
  },
  {
    id: 'ALRT-DNT-2026-0519-005',
    status: 'extinguished',
    severity: 'low',
    title: 'False Alarm',
    location: {
      state: 'Chhattisgarh',
      district: 'Dantewada Forest',
      forestDivision: 'Dantewada',
      range: 'Zone 5B',
      beat: 'Beat 8',
      coordinates: { lat: 18.8997, lng: 81.3508 }
    },
    detection: { method: 'combined', confidence: 45, time: '2026-05-19T08:45:00Z' },
    risk: { level: 'Low', score: 15 },
    environment: { temperature: 36, humidity: 28, windSpeed: 6, windDirection: 'NW' },
    impact: { areaAffectedHa: 0 },
    response: { actionsTaken: [] },
    history: [],
    evidence: { 
      images: [],
      sources: { satellite: 45, iot: 40 }
    }
  }
];
