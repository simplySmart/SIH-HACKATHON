import fs from 'fs';
let content = fs.readFileSync('server.ts', 'utf-8');

const importAdd = `import { getIncidentsStore, triggerSync } from './server/services/incidentService';\n`;
if (!content.includes('getIncidentsStore')) {
  content = content.replace("import { getWeather }", importAdd + "import { getWeather }");
}

const routesAdd = `
  app.get('/api/incidents', async (req, res) => {
    res.json({ data: getIncidentsStore() });
  });

  app.post('/api/incidents/sync', async (req, res) => {
    try {
      const data = await triggerSync();
      res.json({ data });
    } catch(e: any) {
      res.status(500).json({ error: e.message });
    }
  });
`;

if (!content.includes('/api/incidents')) {
  content = content.replace("app.get('/api/fires',", routesAdd + "\n  app.get('/api/fires',");
  fs.writeFileSync('server.ts', content);
  console.log("Updated server.ts with incident routes");
} else {
  console.log("Incident routes already exist?");
}
