import fs from 'fs';
let content = fs.readFileSync('server/services/incidentService.ts', 'utf-8');

const replacement = `
      // Clean invalid rings if necessary
      if (cgForests.features) {
        cgForests.features.forEach((feature: any) => {
          const ensureClosed = (ring: any[]) => {
             if (ring.length > 0) {
                const first = ring[0];
                const last = ring[ring.length - 1];
                if (first[0] !== last[0] || first[1] !== last[1]) {
                   ring.push([...first]);
                }
             }
             return ring;
          };

          if (feature.geometry && feature.geometry.type === 'Polygon') {
            feature.geometry.coordinates = feature.geometry.coordinates
               .filter((ring: any) => ring.length >= 3)
               .map(ensureClosed);
          } else if (feature.geometry && feature.geometry.type === 'MultiPolygon') {
            feature.geometry.coordinates = feature.geometry.coordinates.map((poly: any) => 
              poly.filter((ring: any) => ring.length >= 3).map(ensureClosed)
            ).filter((poly: any) => poly.length > 0);
          }
        });
      }
`;

content = content.replace(/ \/\/ Clean invalid rings if necessary[\s\S]*? \}\);[\s\S]*? \}\);[\s\S]*? \}/, replacement);

fs.writeFileSync('server/services/incidentService.ts', content);
console.log("Fixed ring closing");
