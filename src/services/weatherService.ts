import { WeatherSnapshot } from '../types';
import { config } from '../config';
import { mockWeather } from '../data/systemStatus';

interface WeatherCache {
  [key: string]: {
    data: WeatherSnapshot;
    expiresAt: number;
  };
}

const CACHE_DURATION_MS = 15 * 60 * 1000; // 15 minutes
const weatherCache: WeatherCache = {};

// Helper to round coordinates to ~11km grid (0.1 degree) to deduplicate close requests
const getGridKey = (lat: number, lng: number): string => {
  return `${lat.toFixed(1)},${lng.toFixed(1)}`;
};

export const WeatherService = {
  getWeatherForLocation: async (lat: number, lng: number): Promise<WeatherSnapshot> => {
    if (config.DEMO_MODE) {
      return mockWeather;
    }

    const gridKey = getGridKey(lat, lng);
    const now = Date.now();

    if (weatherCache[gridKey] && weatherCache[gridKey].expiresAt > now) {
      return weatherCache[gridKey].data;
    }

    try {
      // Open-Meteo API
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,wind_direction_10m,wind_gusts_10m,surface_pressure,vapor_pressure_deficit&hourly=soil_moisture_0_to_7cm&timezone=auto`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch weather from Open-Meteo');
      }

      const data = await response.json();
      
      // Get most recent hourly data for soil moisture
      const currentHour = new Date().getHours();
      const soilMoisture = data.hourly?.soil_moisture_0_to_7cm?.[currentHour] || undefined;

      const snapshot: WeatherSnapshot = {
        latitude: lat,
        longitude: lng,
        timestamp: data.current.time,
        temperature: data.current.temperature_2m,
        humidity: data.current.relative_humidity_2m,
        precipitation: data.current.precipitation,
        windSpeed: data.current.wind_speed_10m,
        windDirection: data.current.wind_direction_10m,
        windGust: data.current.wind_gusts_10m,
        soilMoisture: soilMoisture,
        vpd: data.current.vapor_pressure_deficit,
        source: 'Open-Meteo',
        retrievedAt: new Date().toISOString()
      };

      weatherCache[gridKey] = {
        data: snapshot,
        expiresAt: now + CACHE_DURATION_MS
      };

      return snapshot;
    } catch (error) {
      console.error('WeatherService Error:', error);
      throw error;
    }
  }
};
