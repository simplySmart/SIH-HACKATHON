import express from 'express';
import path from 'path';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import { getFires } from './server/services/firmsService';
import { getWeather } from './server/services/weatherService';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Add CORS if necessary
  app.use(cors());
  app.use(express.json());

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.get('/api/fires', async (req, res) => {
    const result = await getFires();
    res.json(result);
  });

  app.get('/api/fires/recent', async (req, res) => {
    // A more scoped down version of fires for real-time dashboards
    const result = await getFires();
    if (result.data) {
       result.data = result.data.slice(0, 10); // Return top 10
    }
    res.json(result);
  });

  app.get('/api/weather', async (req, res) => {
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
  });

  app.get('/api/config/sources', (req, res) => {
    res.json({
      sources: [
        { name: 'NASA FIRMS', type: 'Satellite', status: process.env.FIRMS_MAP_KEY && process.env.FIRMS_MAP_KEY !== 'YOUR_FIRMS_MAP_KEY' ? 'Configured' : 'Unconfigured' },
        { name: 'Open-Meteo', type: 'Weather', status: 'Configured' },
        { name: 'OpenStreetMap / GIS', type: 'Map', status: 'Configured' }
      ]
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // For React Router fallback
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
