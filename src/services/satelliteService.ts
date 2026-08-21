import { mockSatelliteDetections, mockSatellitePasses, mockSatelliteStatus } from '../data/satellite';
import { SatelliteDetection, SatellitePass, SatelliteStatus } from '../types';
import { config } from '../config';

export const SatelliteService = {
  getStatus: async (): Promise<SatelliteStatus[]> => {
    return Promise.resolve([...mockSatelliteStatus]);
  },
  getPasses: async (): Promise<SatellitePass[]> => {
    return Promise.resolve([...mockSatellitePasses]);
  },
  getDetections: async (): Promise<SatelliteDetection[]> => {
    if (config.DEMO_MODE) {
      return Promise.resolve([...mockSatelliteDetections]);
    }
    
    try {
      const response = await fetch(`${config.API_BASE_URL}/fires`);
      if (!response.ok) throw new Error('Failed to fetch real satellite data');
      const result = await response.json();
      
      if (result.data && result.data.length > 0) {
        return result.data.map((fire: any, idx: number) => ({
          id: `SAT-${Date.now()}-${idx}`,
          source: 'VIIRS',
          coordinates: { lat: parseFloat(fire.latitude) || 0, lng: parseFloat(fire.longitude) || 0 },
          confidence: parseFloat(fire.confidence) || 85,
          frp: parseFloat(fire.frp) || 15.0,
          detectedAt: fire.acq_date && fire.acq_time ? `${fire.acq_date}T${fire.acq_time}Z` : new Date().toISOString(),
          verified: false
        }));
      }
      
      return Promise.resolve([]);
    } catch (error) {
      console.error('Error fetching satellite data, falling back to mock data', error);
      return Promise.resolve([...mockSatelliteDetections]);
    }
  }
};
