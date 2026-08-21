import { mockSatelliteDetections, mockSatellitePasses, mockSatelliteStatus } from '../data/satellite';
import { SatelliteDetection, SatellitePass, SatelliteStatus } from '../types';
import { config } from '../config';
import { loadGeoData, getDistrictForPoint, isInsideChhattisgarh, getForestScreening } from '../utils/geo';

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
        // Load geographic data if not already loaded
        await loadGeoData();

        return result.data.map((fire: any, idx: number) => {
          const lat = parseFloat(fire.latitude) || 0;
          const lng = parseFloat(fire.longitude) || 0;
          
          const insideCG = isInsideChhattisgarh(lat, lng);
          const district = getDistrictForPoint(lat, lng) || 'Unknown / unavailable';
          const { screening, distanceKm } = getForestScreening(lat, lng);
          const landContext = insideCG ? 'Chhattisgarh' : 'Outside State';

          return {
            id: `SAT-${Date.now()}-${idx}`,
            satelliteName: fire.satellite === 'MODIS' ? 'MODIS' : 'VIIRS',
            coordinates: { lat, lng },
            confidence: parseFloat(fire.confidence) || 85,
            frp: parseFloat(fire.frp) || 15.0,
            timestamp: fire.acq_date && fire.acq_time ? `${fire.acq_date}T${fire.acq_time}Z` : new Date().toISOString(),
            district,
            landContext,
            forestScreening: screening,
            screeningDistance: distanceKm
          } as SatelliteDetection;
        });
      }
      
      return Promise.resolve([]);
    } catch (error) {
      console.error('Error fetching satellite data, falling back to mock data', error);
      return Promise.resolve([...mockSatelliteDetections]);
    }
  }
};
