import { mockSystemStatus } from '../data/systemStatus';
import { SystemStatus, WeatherSnapshot } from '../types';
import { FireService } from './fireService';
import { WeatherService } from './weatherService';
import { config } from '../config';

export const SystemService = {
  getStatus: async (): Promise<SystemStatus> => {
    const incidents = await FireService.getIncidents();
    const activeAlerts = incidents.filter(i => ['detected', 'verifying', 'confirmed', 'responding'].includes(i.status)).length;
    return Promise.resolve({
      ...mockSystemStatus,
      activeAlertsCount: activeAlerts
    });
  },
  getWeather: async (): Promise<WeatherSnapshot> => {
    try {
      // Defaulting to central Chhattisgarh for general system view
      return await WeatherService.getWeatherForLocation(21.25, 81.62);
    } catch (error) {
      console.error('Error fetching regional weather data', error);
      // Return a minimal error snapshot or the mock
      return {
        latitude: 21.25,
        longitude: 81.62,
        timestamp: new Date().toISOString(),
        source: 'Error (Unavailable)',
        retrievedAt: new Date().toISOString()
      };
    }
  }
};
