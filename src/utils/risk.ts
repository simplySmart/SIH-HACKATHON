import { IncidentSeverity } from '../types';

export function getRiskScore(severity: IncidentSeverity): number {
  switch (severity) {
    case 'low': return 25;
    case 'moderate': return 50;
    case 'high': return 75;
    case 'critical': return 100;
    default: return 0;
  }
}
