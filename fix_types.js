import fs from 'fs';
let content = fs.readFileSync('src/types.ts', 'utf-8');

const additions = `
  firstDetectedAt?: string;
  lastDetectedAt?: string;
  detectionCount?: number;
  satelliteSources?: string[];
  latestConfidence?: number;
  maximumFRP?: number;
  satelliteDetections?: any[];
`;

if (!content.includes('firstDetectedAt')) {
  content = content.replace("location: LocationHierarchy;", "location: LocationHierarchy;" + additions);
  fs.writeFileSync('src/types.ts', content);
  console.log("Updated types.ts");
}
