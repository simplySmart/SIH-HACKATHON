import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FireIncident } from '../types';
import { FireService } from '../services/fireService';
import IncidentDetails from './IncidentDetails';

export default function IncidentDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [incident, setIncident] = useState<FireIncident | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      FireService.getIncidentById(id).then((data) => {
        setIncident(data || null);
        setLoading(false);
      });

      const unsubscribe = FireService.subscribe((incidents) => {
        const updated = incidents.find(i => i.id === id);
        if (updated) setIncident(updated);
      });
      return () => unsubscribe();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <span className="text-slate-400">Loading incident details...</span>
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <span className="text-slate-400 mb-4">Incident not found.</span>
        <button 
          onClick={() => navigate('/incidents')}
          className="px-4 py-2 bg-green-50 text-green-700 font-medium rounded-lg"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <IncidentDetails 
      incident={incident} 
      onBack={() => navigate('/incidents')} 
    />
  );
}
