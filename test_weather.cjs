require('dotenv').config();
const baseUrl = process.env.WEATHER_API_BASE_URL || 'https://api.open-meteo.com/v1/forecast';
const lat = 21.25, lng = 81.62;
const url = `${baseUrl}?latitude=${lat}&longitude=${lng}&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m`;
console.log('Testing URL:', url);
fetch(url).then(r => console.log(r.status, r.statusText)).catch(console.error);
