import fs from 'fs';

let content = fs.readFileSync('src/components/CommandCenter.tsx', 'utf-8');

// 1. Add RefreshCw to imports
if (!content.includes('RefreshCw')) {
  content = content.replace('ThermometerSun}', 'ThermometerSun, RefreshCw}');
}

// 2. Add isSyncing state and handleSync function
if (!content.includes('const [isSyncing')) {
  const insertIndex = content.indexOf('useEffect(() => {');
  const codeToInsert = `
  const [isSyncing, setIsSyncing] = useState(false);
  const handleSync = async () => {
    setIsSyncing(true);
    await FireService.syncFirmsData();
    const updatedIncidents = await FireService.getIncidents();
    setIncidents(updatedIncidents);
    setIsSyncing(false);
  };
  `;
  content = content.slice(0, insertIndex) + codeToInsert + content.slice(insertIndex);
}

fs.writeFileSync('src/components/CommandCenter.tsx', content);
