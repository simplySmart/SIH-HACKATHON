import { SatelliteDetection, SatellitePass, SatelliteStatus } from '../types';

export const mockSatelliteStatus: SatelliteStatus[] = [
  {
    name: 'VIIRS',
    status: 'Online',
    latestPass: '10:42 AM',
    detectionCount: 14,
    resolution: '375m',
    lastUpdate: '5 mins ago'
  },
  {
    name: 'MODIS',
    status: 'Online',
    latestPass: '11:07 AM',
    detectionCount: 8,
    resolution: '1km',
    lastUpdate: '2 mins ago'
  }
];

export const mockSatellitePasses: SatellitePass[] = [
  { id: 'PASS-01', satelliteName: 'VIIRS', passTime: '10:42 AM', status: 'completed' },
  { id: 'PASS-02', satelliteName: 'MODIS', passTime: '11:07 AM', status: 'completed' },
  { id: 'PASS-03', satelliteName: 'VIIRS', passTime: '02:15 PM', status: 'scheduled' }
];

export const mockSatelliteDetections: SatelliteDetection[] = [
  {
    id: 'DET-V-001',
    satelliteName: 'VIIRS',
    timestamp: '10:43 AM',
    coordinates: { lat: 18.8, lng: 80.7 },
    confidence: 94,
    frp: 45.2,
    linkedIncidentId: 'INC-2023-089',
    district: 'Bijapur',
    forestScreening: 'FOREST',
    screeningDistance: 0
  },
  {
    id: 'DET-V-002',
    satelliteName: 'VIIRS',
    timestamp: '10:45 AM',
    coordinates: { lat: 19.1, lng: 81.2 },
    confidence: 65,
    frp: 12.4,
    district: 'Bastar',
    forestScreening: 'FOREST',
    screeningDistance: 0
  },
  {
    id: 'DET-M-001',
    satelliteName: 'MODIS',
    timestamp: '11:08 AM',
    coordinates: { lat: 18.82, lng: 80.71 }, // Close to V-001
    confidence: 88,
    frp: 88.0,
    linkedIncidentId: 'INC-2023-089',
    district: 'Bijapur',
    forestScreening: 'FOREST',
    screeningDistance: 0
  },
  {
    id: 'DET-M-002',
    satelliteName: 'MODIS',
    timestamp: '11:10 AM',
    coordinates: { lat: 18.5, lng: 81.5 },
    confidence: 78,
    frp: 35.1,
    district: 'Sukma',
    forestScreening: 'FOREST',
    screeningDistance: 0
  },
  {
    id: 'DET-V-003',
    satelliteName: 'VIIRS',
    timestamp: '10:48 AM',
    coordinates: { lat: 20.5, lng: 81.6 },
    confidence: 98,
    frp: 110.5,
    linkedIncidentId: 'INC-2023-090',
    district: 'Kanker',
    forestScreening: 'FOREST',
    screeningDistance: 0
  }
];
