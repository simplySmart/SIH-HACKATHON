import { config } from 'dotenv';
config();

// Simple in-memory cache
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache: Record<string, CacheEntry<any>> = {};
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

export interface ServiceResponse<T> {
  data: T | null;
  metadata: {
    source: string;
    retrievedAt: string;
    dataAge: number; // in milliseconds
    status: 'LIVE' | 'STALE' | 'ERROR';
    error?: string;
  };
}

export const getFires = async (): Promise<ServiceResponse<any[]>> => {
  const cacheKey = 'firms_fires';
  const now = Date.now();

  if (cache[cacheKey] && now - cache[cacheKey].timestamp < CACHE_TTL) {
    return {
      data: cache[cacheKey].data,
      metadata: {
        source: 'NASA FIRMS (Cache)',
        retrievedAt: new Date(cache[cacheKey].timestamp).toISOString(),
        dataAge: now - cache[cacheKey].timestamp,
        status: 'LIVE'
      }
    };
  }

  const firmsKey = process.env.FIRMS_MAP_KEY;
  let url = '';
  let isPublic = false;
  
  if (!firmsKey || firmsKey === 'YOUR_FIRMS_MAP_KEY') {
    // Fallback to public open FIRMS dataset if no key is configured
    url = 'https://firms.modaps.eosdis.nasa.gov/data/active_fire/suomi-npp-viirs-c2/csv/SUOMI_VIIRS_C2_South_Asia_24h.csv';
    isPublic = true;
  } else {
    // Use API endpoint for a broad India/South Asia bounding box to ensure we capture active fires
    url = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${firmsKey}/MODIS_NRT/68,6,98,36/1`;
  }

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`FIRMS API Error: ${response.status} ${response.statusText}`);
    }

    const csvData = await response.text();
    const lines = csvData.split('\n').filter(l => l.trim().length > 0);
    const headers = lines[0].split(',');
    
    let parsedData = lines.slice(1).map(line => {
      const values = line.split(',');
      const obj: any = {};
      headers.forEach((h, i) => { obj[h] = values[i]; });
      return obj;
    });

    if (isPublic) {
      // Manually apply bounding box filter for South Asia broadly
      parsedData = parsedData.filter(d => {
        const lat = parseFloat(d.latitude);
        const lng = parseFloat(d.longitude);
        return lat >= 6 && lat <= 36 && lng >= 68 && lng <= 98;
      });
    }

    parsedData = parsedData.slice(0, 100); // Allow up to 100 markers

    cache[cacheKey] = { data: parsedData, timestamp: now };

    return {
      data: parsedData,
      metadata: {
        source: isPublic ? 'NASA FIRMS (Public 24h)' : 'NASA FIRMS (MODIS API)',
        retrievedAt: new Date(now).toISOString(),
        dataAge: 0,
        status: 'LIVE'
      }
    };
  } catch (error: any) {
    console.error('Failed to fetch from FIRMS:', error);
    
    // Return stale data if available
    if (cache[cacheKey]) {
      return {
        data: cache[cacheKey].data,
        metadata: {
          source: 'NASA FIRMS (Stale)',
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
        source: 'NASA FIRMS',
        retrievedAt: new Date().toISOString(),
        dataAge: 0,
        status: 'ERROR',
        error: error.message || 'Unknown error fetching FIRMS data'
      }
    };
  }
};
