import fs from 'fs';
const content = fs.readFileSync('server.ts', 'utf-8');
const importAddition = `import { getFires, getHistoricalFires } from './server/services/firmsService';`;
let newContent = content.replace("import { getFires } from './server/services/firmsService';", importAddition);

const routeAddition = `
  app.get('/api/analytics/historical', async (req, res) => {
    const result = await getHistoricalFires();
    res.json(result);
  });
`;

if (!newContent.includes('/api/analytics/historical')) {
  newContent = newContent.replace("app.get('/api/weather',", routeAddition + "\n  app.get('/api/weather',");
  fs.writeFileSync('server.ts', newContent);
  console.log("Updated server.ts");
}
