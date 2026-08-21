import fs from 'fs';
let content = fs.readFileSync('src/components/CommandCenter.tsx', 'utf-8');

const importAdd = `import { RefreshCw } from 'lucide-react';\n`;
if (!content.includes('RefreshCw')) {
  content = content.replace("import { \n  CloudSun", importAdd + "import { \n  CloudSun");
}

const stateAdd = `
  const [isSyncing, setIsSyncing] = useState(false);
  
  const handleSync = async () => {
    setIsSyncing(true);
    await FireService.refreshIncidents();
    const updated = await FireService.getIncidents();
    setIncidents(updated);
    setIsSyncing(false);
  };
`;
if (!content.includes('isSyncing')) {
  content = content.replace("const [sensors, setSensors] = useState<IotSensor[]>([]);", "const [sensors, setSensors] = useState<IotSensor[]>([]);" + stateAdd);
}

fs.writeFileSync('src/components/CommandCenter.tsx', content);
