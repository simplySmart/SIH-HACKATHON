import { FireIncident, IncidentSeverity } from '../types';
import { Flame, AlertTriangle, CheckCircle2 } from 'lucide-react';

export function mapIncidentToAlertUI(incident: FireIncident) {
  let risk = 'Low';
  let riskColor = 'text-green-500';
  let iconBg = 'bg-green-50';
  let iconColor = 'text-green-500';
  let IconComponent = CheckCircle2;
  
  if (incident.severity === 'high' || incident.severity === 'critical') {
    risk = 'High';
    riskColor = 'text-red-500';
    iconBg = 'bg-red-50';
    iconColor = 'text-red-500';
    IconComponent = Flame;
  } else if (incident.severity === 'moderate') {
    risk = 'Moderate';
    riskColor = 'text-yellow-500';
    iconBg = 'bg-yellow-50';
    iconColor = 'text-yellow-500';
    IconComponent = AlertTriangle;
  }

  let status = 'Resolved';
  let statusColor = 'text-green-500';
  let action = 'View Report';
  if (['detected', 'verifying', 'confirmed', 'responding'].includes(incident.status)) {
    status = 'Active';
    statusColor = 'text-red-500';
    action = 'View Details';
  }

  const d = new Date(incident.detection.time);
  const time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const date = '19 May 2025';

  let desc = 'High temperature & smoke detected';
  if (incident.severity === 'moderate') desc = 'Moderate smoke levels observed';
  if (incident.severity === 'low') desc = 'No fire detected in the area';

  return {
    id: incident.id,
    type: incident.title,
    desc,
    location: incident.location.district,
    zone: incident.location.range,
    risk,
    riskColor,
    time,
    date,
    status,
    statusColor,
    icon: IconComponent,
    iconBg,
    iconColor,
    action,
    originalIncident: incident
  };
}

export function formatArea(ha: number): string {
  return `${ha.toLocaleString()} ha`;
}

export function formatCoordinates(lat: number, lng: number): string {
  return `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? 'N' : 'S'}, ${Math.abs(lng).toFixed(4)}° ${lng >= 0 ? 'E' : 'W'}`;
}
