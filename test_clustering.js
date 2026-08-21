import fs from 'fs';
import { syncIncidents, getIncidentsStore } from './server/services/incidentService.ts';
import { getFires } from './server/services/firmsService.ts';

async function test() {
   const fires = await getFires();
   // Force the first fire to be in CG by altering its lat/lng
   if (fires.data && fires.data.length > 0) {
      fires.data[0].latitude = 21.25;
      fires.data[0].longitude = 81.62;
      fires.data[1].latitude = 21.251; // Cluster it
      fires.data[1].longitude = 81.621;
   }
   
   // Actually, this mutates the cache! So syncIncidents will see it.
   await syncIncidents();
   const incidents = getIncidentsStore();
   console.log("Incidents created:", incidents.length);
   if (incidents.length > 0) {
     console.log("First incident cluster size:", incidents[0].detectionCount);
     console.log("Detections:", incidents[0].satelliteDetections.length);
   }
}
test();
