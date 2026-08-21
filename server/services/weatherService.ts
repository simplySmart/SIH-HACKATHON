import { config } from 'dotenv';
config();

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache: Record<string, CacheEntry<any>> = {};
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

import { ServiceResponse } from './firmsService'; // reuse interface

export const getWeather = async (lat: number, lng: number): Promise<ServiceResponse<any>> => {
  const cacheKey = `weather_${lat.toFixed(2)}_${lng.toFixed(2)}`;
  const now = Date.now();

  if (cache[cacheKey] && now - cache[cacheKey].timestamp < CACHE_TTL) {
    return {
      data: cache[cacheKey].data,
      metadata: {
        source: 'Open-Meteo (Cache)',
        retrievedAt: new Date(cache[cacheKey].timestamp).toISOString(),
        dataAge: now - cache[cacheKey].timestamp,
        status: 'LIVE'
      }
    };
  }

  const baseUrl = 'https://api.open-meteo.com/v1/forecast';
  
  try {
    const url = `${baseUrl}?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,wind_direction_10m,wind_gusts_10m,vapor_pressure_deficit&hourly=soil_moisture_0_to_7cm&timezone=auto`;
    console.log('Fetching:', url); const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Weather API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    cache[cacheKey] = { data, timestamp: now };

    return {
      data,
      metadata: {
        source: 'Open-Meteo',
        retrievedAt: new Date(now).toISOString(),
        dataAge: 0,
        status: 'LIVE'
      }
    };
  } catch (error: any) {
    console.error('Failed to fetch from Open-Meteo:', error);
    
    if (cache[cacheKey]) {
      return {
        data: cache[cacheKey].data,
        metadata: {
          source: 'Open-Meteo (Stale)',
          retrievedAt: new Date(cache[cacheKey].timestamp).toISOString(),
          dataAge: now - cache[cacheKey].timestamp,
          status: 'STALE',
          error: error.message
        }
      };
    }

    return {
      data: null,
      metadata: {
        source: 'Open-Meteo',
        retrievedAt: new Date().toISOString(),
        dataAge: 0,
        status: 'ERROR',
        error: error.message || 'Unknown error fetching Weather data'
      }
    };
  }
};
