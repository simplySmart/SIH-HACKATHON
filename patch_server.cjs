const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const target = `  app.get('/api/weather', async (req, res) => {
    // Default to central Chhattisgarh coordinates if none provided
    const lat = parseFloat(req.query.lat as string) || 21.25;
    const lng = parseFloat(req.query.lng as string) || 81.62;
    const result = await getWeather(lat, lng);
    res.json(result);
  });`;

const replacement = `  app.get('/api/weather', async (req, res) => {
    // Default to central Chhattisgarh coordinates if none provided
    const lat = parseFloat(req.query.lat as string) || 21.25;
    const lng = parseFloat(req.query.lng as string) || 81.62;
    const result = await getWeather(lat, lng);
    res.json(result);
  });

  app.get('/api/weather/status', async (req, res) => {
    try {
      // Fetch for default region to check status
      const result = await getWeather(21.25, 81.62);
      res.json({
        service: 'Open-Meteo',
        status: result.metadata.status === 'ERROR' ? 'down' : 'operational',
        lastChecked: result.metadata.retrievedAt,
        details: result.metadata
      });
    } catch (e) {
      res.json({
        service: 'Open-Meteo',
        status: 'down',
        error: e.message
      });
    }
  });`;

if (code.includes(target.trim())) {
  code = code.replace(target.trim(), replacement.trim());
  fs.writeFileSync('server.ts', code);
  console.log('server.ts patched successfully.');
} else {
  console.log('Target not found in server.ts');
}
