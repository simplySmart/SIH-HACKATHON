import https from 'https';
const options = {
  hostname: 'overpass-api.de',
  port: 443,
  path: '/api/interpreter',
  method: 'POST',
  family: 4,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
};
const req = https.request(options, res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log(res.statusCode, data.substring(0, 100)));
});
req.on('error', e => console.error(e));
req.write('[out:json][timeout:5];(node["place"](around:1000, 21.25, 81.62););out geom;');
req.end();
