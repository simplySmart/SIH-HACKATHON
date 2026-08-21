export type IncidentStatus = 'detected' | 'verifying' | 'confirmed' | 'responding' | 'contained' | 'extinguished' | 'rejected';
export type IncidentSeverity = 'low' | 'moderate' | 'high' | 'critical';

export interface LocationHierarchy {
  state: string;
  district: string;
  forestDivision: string;
  range: string;
  beat: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface IncidentEvent {
  id: string;
  timestamp: string;
  description: string;
  type: string;
}

export interface EnvironmentData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
}

export interface FireIncident {
  id: string;
  status: IncidentStatus;
  severity: IncidentSeverity;
  title: string;
  location: LocationHierarchy;
  detection: {
    method: 'satellite' | 'sensor' | 'manual' | 'combined';
    confidence: number;
    time: string;
    landContext?: string;
    forestScreening?: 'FOREST' | 'NEAR FOREST' | 'NON-FOREST' | 'UNKNOWN';
    screeningDistance?: number;
  };
  risk: {
    level: string;
    score: number;
  };
  environment: EnvironmentData;
  impact: {
    areaAffectedHa: number;
    estimatedDamage?: string;
  };
  response: {
    teamAssigned?: string;
    personnel?: number;
    distanceKm?: number;
    etaMins?: number;
    nearestWater?: string;
    nearestRoad?: string;
    actionsTaken: string[];
  };
  history: IncidentEvent[];
  evidence: {
    images: string[];
    video?: string;
    sources?: {
      satellite?: number;
      iot?: number;
      camera?: number;
      field?: number;
      weather?: number;
    };
  };
}

export interface SatelliteDetection {
  id: string;
  satelliteName: 'VIIRS' | 'MODIS';
  timestamp: string;
  coordinates: { lat: number; lng: number };
  confidence: number;
  frp?: number;
  linkedIncidentId?: string;
  district: string;
  landContext?: string;
  forestScreening?: 'FOREST' | 'NEAR FOREST' | 'NON-FOREST' | 'UNKNOWN';
  screeningDistance?: number;
}

export interface SatellitePass {
  id: string;
  satelliteName: 'VIIRS' | 'MODIS';
  passTime: string;
  status: 'completed' | 'processing' | 'scheduled';
}

export interface SatelliteStatus {
  name: 'VIIRS' | 'MODIS';
  status: 'Online' | 'Offline' | 'Degraded';
  latestPass: string;
  detectionCount: number;
  resolution: string;
  lastUpdate: string;
}

export interface IotSensorHistory {
  time: string;
  temperature: number;
  humidity: number;
  smoke: number;
}

export interface IotSensor {
  id: string;
  district: string;
  coordinates: { lat: number; lng: number };
  status: 'Normal' | 'Warning' | 'Fire Anomaly' | 'Offline';
  temperature: number;
  humidity: number;
  smoke: number;
  co: number;
  battery: 'Good' | 'Medium' | 'Low';
  signalStrength: 'Good' | 'Weak' | 'Offline';
  lastUpdate: string;
  gatewayId: string;
  history: IotSensorHistory[];
}

export interface IotGateway {
  id: string;
  location: string;
  connectedSensors: number;
  lastHeartbeat: string;
  status: 'Online' | 'Offline';
}

export interface FireRisk {
  zoneId: string;
  zoneName: string;
  riskScore: number;
  riskLevel: IncidentSeverity;
}

export interface ResponseTeam {
  id: string;
  name: string;
  personnelCount: number;
  status: 'available' | 'deployed' | 'rest';
  currentIncidentId?: string;
}

export interface FireReport {
  id: string;
  incidentId: string;
  summary: string;
  generatedAt: string;
  author: string;
}

export interface District {
  id: string;
  name: string;
  totalForestArea: number;
}

export interface SystemStatus {
  overallHealth: 'operational' | 'degraded' | 'down';
  activeAlertsCount: number;
  monitoredZonesCount: number;
  sensorsOnlineCount: number;
  sensorsTotalCount: number;
  firesDetectedToday: number;
  areaAtRiskKm2: number;
  lastUpdated: string;
}

export interface WeatherSnapshot {
  latitude: number;
  longitude: number;
  timestamp: string;
  temperature?: number;
  humidity?: number;
  precipitation?: number;
  windSpeed?: number;
  windDirection?: number;
  windGust?: number;
  soilMoisture?: number;
  vpd?: number;
  source: string;
  retrievedAt: string;
}

export interface DistrictRisk {
  id: string;
  district: string;
  riskScore: number;
  riskClass: 'Low' | 'Moderate' | 'High' | 'Very High' | 'Extreme';
  drivers: {
    temperature: number;
    humidity: number;
    windSpeed: number;
    recentRainfall: number;
    fuelDryness: 'Low' | 'Moderate' | 'High' | 'Extreme';
    historicalFreq: 'Low' | 'Moderate' | 'High';
  };
  forecast: {
    now: number;
    plus24h: number;
    plus48h: number;
  };
}

export interface SpreadSimulation {
  timeHours: number;
  areaHa: number;
  radiusMeters: number;
}

