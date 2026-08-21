import { mockDistrictRisks } from '../data/risk';
import { DistrictRisk, FireIncident, SpreadSimulation } from '../types';

export const RiskService = {
  getDistrictRisks: async (): Promise<DistrictRisk[]> => {
    return Promise.resolve([...mockDistrictRisks].sort((a, b) => b.riskScore - a.riskScore));
  },

  getFireSpreadSimulation: async (incident: FireIncident): Promise<SpreadSimulation[]> => {
    // Deterministic demo calculation
    // Base spread rate per hour based on environment and risk
    const tempFactor = incident.environment.temperature > 35 ? 1.2 : 1.0;
    const windFactor = 1 + (incident.environment.windSpeed / 50); // Wind speed impact
    const humidityFactor = Math.max(0.5, (100 - incident.environment.humidity) / 50);
    const riskFactor = incident.risk.score / 50; // 0 to 2 multiplier

    const baseSpreadRate = 0.2 * tempFactor * windFactor * humidityFactor * riskFactor; // percentage increase per hour

    const currentAreaHa = Math.max(incident.impact.areaAffectedHa, 1); // fallback to 1ha if 0 for demo

    const sim1hArea = currentAreaHa * Math.pow(1 + baseSpreadRate, 1);
    const sim3hArea = currentAreaHa * Math.pow(1 + baseSpreadRate, 3);
    const sim6hArea = currentAreaHa * Math.pow(1 + baseSpreadRate, 6);

    // Area of circle = pi * r^2
    // 1 Ha = 10,000 sq meters
    // radius = sqrt((AreaHa * 10000) / pi)
    
    return Promise.resolve([
      {
        timeHours: 1,
        areaHa: parseFloat(sim1hArea.toFixed(2)),
        radiusMeters: Math.sqrt((sim1hArea * 10000) / Math.PI)
      },
      {
        timeHours: 3,
        areaHa: parseFloat(sim3hArea.toFixed(2)),
        radiusMeters: Math.sqrt((sim3hArea * 10000) / Math.PI)
      },
      {
        timeHours: 6,
        areaHa: parseFloat(sim6hArea.toFixed(2)),
        radiusMeters: Math.sqrt((sim6hArea * 10000) / Math.PI)
      }
    ]);
  }
};
