import fs from 'fs';
import https from 'https';
const key = 'e86e7970a10339321ce991bc40e72353';
const dates = ['2024-03-01', '2025-03-01', '2026-03-01'];
async function fetchDates() {
  let allData = [];
  for (const date of dates) {
    const url = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${key}/VIIRS_SNPP_SP/80,17.5,84.5,24.5/5/${date}`;
    console.log("Fetching", url);
    const res = await fetch(url);
    const text = await res.text();
    allData.push(text);
  }
  fs.writeFileSync('historical_test.csv', allData.join('\n'));
}
fetchDates();
