import fs from 'fs';
let content = fs.readFileSync('server.ts', 'utf-8');

const importAdd = `import { getGisContext } from './server/services/gisService';\n`;
content = content.replace("import { getWeather }", importAdd + "import { getWeather }");

const routeAdd = `
  app.get('/api/gis/context', async (req, res) => {
    const lat = parseFloat(req.query.lat as string);
    const lng = parseFloat(req.query.lng as string);
    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({ error: 'Invalid coordinates' });
    }
    const result = await getGisContext(lat, lng);
    res.json(result);
  });
`;

if (!content.includes('/api/gis/context')) {
  content = content.replace("app.get('/api/weather',", routeAdd + "\n  app.get('/api/weather',");
  fs.writeFileSync('server.ts', content);
  console.log("Added /api/gis/context to server.ts");
}
