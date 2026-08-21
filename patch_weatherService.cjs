const fs = require('fs');
let code = fs.readFileSync('server/services/weatherService.ts', 'utf8');
code = code.replace("const response = await fetch(url);", "console.log('Fetching:', url); const response = await fetch(url);");
fs.writeFileSync('server/services/weatherService.ts', code);
