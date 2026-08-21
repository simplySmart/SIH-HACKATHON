import fs from 'fs';
const content = fs.readFileSync('server/services/firmsService.ts', 'utf-8');
const addition = `
import fsSync from 'fs';
import path from 'path';

export const getHistoricalFires = async (): Promise<ServiceResponse<any[]>> => {
  const dataPath = path.join(process.cwd(), 'historical_test.csv');
  try {
    if (fsSync.existsSync(dataPath)) {
      const csvData = fsSync.readFileSync(dataPath, 'utf-8');
      const lines = csvData.split('\\n').filter(l => l.trim().length > 0);
      const headers = lines[0].split(',');
      
      let parsedData = lines.slice(1).map(line => {
        // Handle lines that might be headers if we concatenated multiple requests
        if (line.startsWith('latitude')) return null; 
        
        const values = line.split(',');
        const obj: any = {};
        headers.forEach((h, i) => { obj[h] = values[i]; });
        return obj;
      }).filter(Boolean);
      
      return {
        data: parsedData,
        metadata: {
          source: 'NASA FIRMS (Historical Cache)',
          retrievedAt: new Date().toISOString(),
          dataAge: 0,
          status: 'LIVE'
        }
      };
    } else {
      return { data: [], metadata: { source: '', retrievedAt: '', dataAge: 0, status: 'ERROR', error: 'No cache' } };
    }
  } catch (err: any) {
    return { data: [], metadata: { source: '', retrievedAt: '', dataAge: 0, status: 'ERROR', error: err.message } };
  }
};
`;

if (!content.includes('getHistoricalFires')) {
  fs.writeFileSync('server/services/firmsService.ts', content + addition);
  console.log("Updated firmsService.ts");
}
