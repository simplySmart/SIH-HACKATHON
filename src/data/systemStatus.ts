import { SystemStatus, WeatherSnapshot } from '../types';

export const mockSystemStatus: SystemStatus = {
  overallHealth: 'operational',
  activeAlertsCount: 7,
  monitoredZonesCount: 128,
  sensorsOnlineCount: 256,
  sensorsTotalCount: 270,
  firesDetectedToday: 3,
  areaAtRiskKm2: 12.4,
  lastUpdated: new Date().toISOString()
};

export const mockWeather: WeatherSnapshot = {
  latitude: 21.25,
  longitude: 81.62,
  timestamp: new Date().toISOString(),
  temperature: 32,
  humidity: 45,
  precipitation: 0,
  windSpeed: 10,
  windDirection: 180,
  windGust: 15,
  soilMoisture: 0.1,
  vpd: 1.5,
  source: 'Mock Data',
  retrievedAt: new Date().toISOString()
};
