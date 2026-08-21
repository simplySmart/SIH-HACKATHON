import { IotSensor, IotGateway } from '../types';

export const mockGateways: IotGateway[] = [
  {
    id: 'GW-SUK-01',
    location: 'Sukma Central Tower',
    connectedSensors: 42,
    lastHeartbeat: 'Just now',
    status: 'Online'
  },
  {
    id: 'GW-BIJ-02',
    location: 'Bijapur East Relay',
    connectedSensors: 28,
    lastHeartbeat: '2 mins ago',
    status: 'Online'
  }
];

export const mockSensors: IotSensor[] = [
  {
    id: 'CG-SUK-018',
    district: 'Sukma',
    coordinates: { lat: 18.52, lng: 81.51 },
    status: 'Fire Anomaly',
    temperature: 58.4,
    humidity: 12.0,
    smoke: 450,
    co: 120,
    battery: 'Medium',
    signalStrength: 'Good',
    lastUpdate: 'Just now',
    gatewayId: 'GW-SUK-01',
    history: [
      { time: '10:00', temperature: 38, humidity: 25, smoke: 15 },
      { time: '10:15', temperature: 39, humidity: 24, smoke: 18 },
      { time: '10:30', temperature: 45, humidity: 20, smoke: 120 },
      { time: '10:45', temperature: 58, humidity: 12, smoke: 450 }
    ]
  },
  {
    id: 'CG-BIJ-042',
    district: 'Bijapur',
    coordinates: { lat: 18.81, lng: 80.75 },
    status: 'Warning',
    temperature: 44.2,
    humidity: 18.5,
    smoke: 85,
    co: 45,
    battery: 'Good',
    signalStrength: 'Weak',
    lastUpdate: '1 min ago',
    gatewayId: 'GW-BIJ-02',
    history: [
      { time: '10:00', temperature: 35, humidity: 30, smoke: 10 },
      { time: '10:15', temperature: 38, humidity: 25, smoke: 15 },
      { time: '10:30', temperature: 41, humidity: 20, smoke: 45 },
      { time: '10:45', temperature: 44, humidity: 18, smoke: 85 }
    ]
  },
  {
    id: 'CG-SUK-005',
    district: 'Sukma',
    coordinates: { lat: 18.6, lng: 81.45 },
    status: 'Normal',
    temperature: 36.5,
    humidity: 32.0,
    smoke: 12,
    co: 8,
    battery: 'Good',
    signalStrength: 'Good',
    lastUpdate: '5 mins ago',
    gatewayId: 'GW-SUK-01',
    history: [
      { time: '10:00', temperature: 35, humidity: 33, smoke: 10 },
      { time: '10:15', temperature: 36, humidity: 32, smoke: 11 },
      { time: '10:30', temperature: 36, humidity: 32, smoke: 12 },
      { time: '10:45', temperature: 36, humidity: 32, smoke: 12 }
    ]
  },
  {
    id: 'CG-BIJ-022',
    district: 'Bijapur',
    coordinates: { lat: 18.9, lng: 80.65 },
    status: 'Offline',
    temperature: 0,
    humidity: 0,
    smoke: 0,
    co: 0,
    battery: 'Low',
    signalStrength: 'Offline',
    lastUpdate: '2 hours ago',
    gatewayId: 'GW-BIJ-02',
    history: []
  },
  {
    id: 'CG-SUK-088',
    district: 'Sukma',
    coordinates: { lat: 18.45, lng: 81.6 },
    status: 'Normal',
    temperature: 38.1,
    humidity: 28.5,
    smoke: 18,
    co: 15,
    battery: 'Low',
    signalStrength: 'Good',
    lastUpdate: '3 mins ago',
    gatewayId: 'GW-SUK-01',
    history: [
      { time: '10:00', temperature: 37, humidity: 30, smoke: 15 },
      { time: '10:15', temperature: 37, humidity: 29, smoke: 16 },
      { time: '10:30', temperature: 38, humidity: 29, smoke: 18 },
      { time: '10:45', temperature: 38, humidity: 28, smoke: 18 }
    ]
  }
];
