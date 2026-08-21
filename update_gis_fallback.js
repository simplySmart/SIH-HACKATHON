import fs from 'fs';
let content = fs.readFileSync('server/services/gisService.ts', 'utf-8');

const fallback = `
  } catch (error: any) {
    console.error('GIS Service Error:', error);
    
    // Fallback to Nominatim for nearest settlement since Overpass timed out
    try {
      const nomRes = await fetch(\`https://nominatim.openstreetmap.org/reverse?lat=\${lat}&lon=\${lng}&format=json&zoom=10\`, {
        headers: { 'User-Agent': 'VanRakshak App (Research)' },
        signal: AbortSignal.timeout(5000)
      });
      if (nomRes.ok) {
        const nomData = await nomRes.json();
        const settlementName = nomData.address?.city || nomData.address?.town || nomData.address?.village || nomData.address?.county || 'Unknown Location';
        
        const pt1 = turf.point([lng, lat]);
        const pt2 = turf.point([parseFloat(nomData.lon), parseFloat(nomData.lat)]);
        const dist = turf.distance(pt1, pt2, { units: 'kilometers' });
        
        const result = {
          nearestRoad: null,
          nearestWater: null,
          nearestSettlement: {
            name: settlementName,
            type: nomData.addresstype || 'settlement',
            distance: dist.toFixed(1),
            coordinates: [parseFloat(nomData.lat), parseFloat(nomData.lon)]
          },
          source: 'OpenStreetMap (Nominatim)',
          retrievedAt: new Date().toISOString()
        };
        cache[cacheKey] = { data: result, timestamp: now };
        return result;
      }
    } catch (nomErr) {
      console.error('Nominatim Fallback Error:', nomErr);
    }

    return { nearestRoad: null, nearestWater: null, nearestSettlement: null, source: 'OpenStreetMap', error: 'Network Error' };
  }
`;

content = content.replace(/} catch \(error: any\) \{[\s\S]*?Network Error' \};\n  \}/, fallback);
fs.writeFileSync('server/services/gisService.ts', content);
console.log("Updated gisService.ts with Nominatim fallback.");
