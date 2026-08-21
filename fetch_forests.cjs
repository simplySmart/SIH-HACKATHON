const fs = require('fs');
const https = require('https');

const overpassQuery = `
[out:json][timeout:90];
area["name:en"="Chhattisgarh"]->.searchArea;
(
  relation["boundary"="protected_area"](area.searchArea);
  relation["boundary"="national_park"](area.searchArea);
  way["landuse"="forest"](area.searchArea);
  relation["landuse"="forest"](area.searchArea);
);
out geom;
`;

const postData = 'data=' + encodeURIComponent(overpassQuery);

const options = {
  hostname: 'overpass-api.de',
  port: 443,
  path: '/api/interpreter',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': postData.length
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      const features = [];
      
      json.elements.forEach(el => {
        if (el.type === 'way' && el.geometry) {
           features.push({
             type: "Feature",
             properties: {
               name: el.tags.name || el.tags['name:en'] || "Forest Area",
               type: "forest"
             },
             geometry: {
               type: "Polygon",
               coordinates: [el.geometry.map(g => [g.lon, g.lat])]
             }
           });
        }
        else if (el.type === 'relation' && el.members) {
          const coordinates = [];
          el.members.forEach(member => {
            if (member.type === 'way' && member.geometry) {
              const wayCoords = member.geometry.map(g => [g.lon, g.lat]);
              coordinates.push(wayCoords);
            }
          });
          if (coordinates.length > 0) {
            features.push({
              type: "Feature",
              properties: {
                name: el.tags.name || el.tags['name:en'] || "Protected Area",
                type: el.tags.boundary || el.tags.landuse || "forest"
              },
              geometry: {
                type: "Polygon", // Simplified
                coordinates: coordinates
              }
            });
          }
        }
      });
      
      const geojson = {
        type: "FeatureCollection",
        features: features
      };
      
      fs.writeFileSync('./public/data/cg_forests.json', JSON.stringify(geojson));
      console.log('Forest geojson written with', features.length, 'features');
    } catch (e) {
      console.error(e);
      console.log(data.substring(0, 500));
    }
  });
});

req.on('error', (e) => console.error(e));
req.write(postData);
req.end();
