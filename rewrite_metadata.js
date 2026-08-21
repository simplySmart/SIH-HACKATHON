import fs from 'fs';

let indexContent = fs.readFileSync('index.html', 'utf-8');
indexContent = indexContent.replace(/<title>.*?<\/title>/, '<title>AFIRN - Adaptive Forest Intelligence</title>');
fs.writeFileSync('index.html', indexContent);

let metadataContent = fs.readFileSync('metadata.json', 'utf-8');
let metadata = JSON.parse(metadataContent);
metadata.name = "AFIRN";
metadata.description = "Adaptive Forest Intelligence & Response Network for Chhattisgarh Forest Department";
fs.writeFileSync('metadata.json', JSON.stringify(metadata, null, 2));

