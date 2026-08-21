import { mockIncidents } from '../data/incidents';
import { FireIncident, IncidentStatus, IncidentEvent } from '../types';
import { config } from '../config';

let incidents = [...mockIncidents];
let isInitialized = false;

type Listener = (incidents: FireIncident[]) => void;
let listeners: Listener[] = [];

export const FireService = {
  subscribe: (listener: Listener) => {
    listeners.push(listener);
    return () => { listeners = listeners.filter(l => l !== listener); };
  },

  getIncidents: async (): Promise<FireIncident[]> => {
    if (!config.DEMO_MODE) {
      try {
        let response = await fetch(`${config.API_BASE_URL}/incidents`);
        let result = await response.json();
        
        // If it's the first time and backend is empty, let's sync
        if (result.data.length === 0 && !isInitialized) {
          console.log("Empty backend store, triggering sync...");
          response = await fetch(`${config.API_BASE_URL}/incidents/sync`, { method: 'POST' });
          result = await response.json();
        }

        if (result.data) {
          incidents = result.data;
          isInitialized = true;
          listeners.forEach(l => l([...incidents]));
        }
      } catch (error) {
        console.error('Error fetching real incidents from backend:', error);
      }
    }
    return Promise.resolve([...incidents]);
  },

  refreshIncidents: async (): Promise<FireIncident[]> => {
    if (!config.DEMO_MODE) {
      try {
        const response = await fetch(`${config.API_BASE_URL}/incidents/sync`, { method: 'POST' });
        const result = await response.json();
        if (result.data) {
          incidents = result.data;
          listeners.forEach(l => l([...incidents]));
        }
      } catch(e) {
        console.error("Refresh failed", e);
      }
    }
    return Promise.resolve([...incidents]);
  },

  getIncidentById: async (id: string): Promise<FireIncident | undefined> => {
    if (!config.DEMO_MODE && incidents.length === 0 && !isInitialized) {
       await FireService.getIncidents();
    }
    return Promise.resolve(incidents.find(i => i.id === id));
  },

  updateIncidentStatus: async (id: string, status: IncidentStatus, actionTaken?: string, historyEvent?: IncidentEvent) => {
    const idx = incidents.findIndex(i => i.id === id);
    if (idx > -1) {
      const incident = { ...incidents[idx], status };
      if (actionTaken) {
        incident.response = { 
           ...incident.response, 
           actionsTaken: [...incident.response.actionsTaken, actionTaken] 
         };
      }
      if (historyEvent) {
        incident.history = [...incident.history, historyEvent];
      }
      incidents[idx] = incident;
      listeners.forEach(l => l([...incidents]));
      
      // In a real app we'd POST to backend here to save state
    }
  },

  createIncident: async (newIncidentData: Partial<FireIncident>): Promise<FireIncident> => {
    const newId = `INC-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const newIncident: FireIncident = {
      id: newId,
      status: 'detected',
      severity: newIncidentData.severity || 'high',
      title: newIncidentData.title || `Anomaly Detected in ${newIncidentData.location?.district || 'Unknown Zone'}`,
      location: newIncidentData.location || {
        state: 'Chhattisgarh',
        district: 'Unknown / unavailable',
        forestDivision: 'Unknown / unavailable',
        range: 'Unknown / unavailable',
        beat: 'Unknown / unavailable',
        coordinates: { lat: 0, lng: 0 }
      },
      firstDetectedAt: new Date().toISOString(),
      lastDetectedAt: new Date().toISOString(),
      detectionCount: 1,
      satelliteSources: ['Manual/IoT'],
      latestConfidence: 85,
      maximumFRP: 0,
      detection: newIncidentData.detection || {
        method: 'sensor',
        confidence: 85,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      risk: newIncidentData.risk || { level: 'High', score: 85 },
      environment: newIncidentData.environment || {
        temperature: 40,
        humidity: 20,
        windSpeed: 15,
        windDirection: 'NE'
      },
      impact: { areaAffectedHa: 0.5, estimatedDamage: 'Monitoring' },
      response: { actionsTaken: [] },
      history: [
        {
          id: `EVT-${Date.now()}`,
          timestamp: new Date().toISOString(),
          description: 'Fire anomaly escalated from IoT Sensor Network or Manual Entry.',
          type: 'detection'
        }
      ],
      evidence: newIncidentData.evidence || { images: [] },
      satelliteDetections: []
    };

    incidents.unshift(newIncident);
    listeners.forEach(l => l([...incidents]));
    
    // Ideally we would POST this to backend as well.
    return Promise.resolve(newIncident);
  }
};
