import { DistrictRisk } from '../types';

export const mockDistrictRisks: DistrictRisk[] = [
  {
    id: 'DIST-001',
    district: 'Bijapur',
    riskScore: 92,
    riskClass: 'Extreme',
    drivers: {
      temperature: 44,
      humidity: 12,
      windSpeed: 22,
      recentRainfall: 0,
      fuelDryness: 'Extreme',
      historicalFreq: 'High'
    },
    forecast: {
      now: 92,
      plus24h: 95,
      plus48h: 88
    }
  },
  {
    id: 'DIST-002',
    district: 'Sukma',
    riskScore: 88,
    riskClass: 'Very High',
    drivers: {
      temperature: 42,
      humidity: 15,
      windSpeed: 18,
      recentRainfall: 0,
      fuelDryness: 'Extreme',
      historicalFreq: 'High'
    },
    forecast: {
      now: 88,
      plus24h: 90,
      plus48h: 91
    }
  },
  {
    id: 'DIST-003',
    district: 'Bastar',
    riskScore: 75,
    riskClass: 'High',
    drivers: {
      temperature: 39,
      humidity: 22,
      windSpeed: 14,
      recentRainfall: 2,
      fuelDryness: 'High',
      historicalFreq: 'High'
    },
    forecast: {
      now: 75,
      plus24h: 70,
      plus48h: 65
    }
  },
  {
    id: 'DIST-004',
    district: 'Dantewada',
    riskScore: 82,
    riskClass: 'Very High',
    drivers: {
      temperature: 41,
      humidity: 18,
      windSpeed: 15,
      recentRainfall: 0,
      fuelDryness: 'High',
      historicalFreq: 'High'
    },
    forecast: {
      now: 82,
      plus24h: 85,
      plus48h: 86
    }
  },
  {
    id: 'DIST-005',
    district: 'Kanker',
    riskScore: 65,
    riskClass: 'Moderate',
    drivers: {
      temperature: 36,
      humidity: 35,
      windSpeed: 12,
      recentRainfall: 15,
      fuelDryness: 'Moderate',
      historicalFreq: 'Moderate'
    },
    forecast: {
      now: 65,
      plus24h: 60,
      plus48h: 55
    }
  },
  {
    id: 'DIST-006',
    district: 'Raipur',
    riskScore: 40,
    riskClass: 'Low',
    drivers: {
      temperature: 35,
      humidity: 45,
      windSpeed: 10,
      recentRainfall: 20,
      fuelDryness: 'Low',
      historicalFreq: 'Low'
    },
    forecast: {
      now: 40,
      plus24h: 38,
      plus48h: 35
    }
  }
];
