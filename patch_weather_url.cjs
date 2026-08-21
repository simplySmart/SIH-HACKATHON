const fs = require('fs');
let code = fs.readFileSync('server/services/weatherService.ts', 'utf8');

const target = `const baseUrl = process.env.WEATHER_API_BASE_URL || 'https://api.open-meteo.com/v1/forecast';`;
const replacement = `const baseUrl = 'https://api.open-meteo.com/v1/forecast';`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('server/services/weatherService.ts', code);
  console.log('Fixed Open-Meteo URL in backend.');
} else {
  console.log('URL target not found.');
}
