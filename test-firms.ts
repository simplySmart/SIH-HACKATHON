import { config } from 'dotenv';
config();
async function test() {
  const firmsKey = process.env.FIRMS_MAP_KEY;
  if (!firmsKey) { console.log('No key'); return; }
  const url = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${firmsKey}/VIIRS_SNPP_NRT/80,17,85,25/1`;
  const response = await fetch(url);
  console.log('Area status:', response.status);
  const text = await response.text();
  console.log('Area text:', text.substring(0, 100));

  const urlCountry = `https://firms.modaps.eosdis.nasa.gov/api/country/csv/${firmsKey}/VIIRS_SNPP_NRT/IND/1`;
  const responseCountry = await fetch(urlCountry);
  console.log('Country status:', responseCountry.status);
  const textCountry = await responseCountry.text();
  console.log('Country text:', textCountry.substring(0, 100));
}
test();
