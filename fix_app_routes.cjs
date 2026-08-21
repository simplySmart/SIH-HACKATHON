const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Remove imports
content = content.replace(/import PatrolUnits from '.\/components\/PatrolUnits';\n/, '');
content = content.replace(/import RiskDashboard from '.\/components\/RiskDashboard';\n/, '');
content = content.replace(/import SatelliteIntelligence from '.\/components\/SatelliteIntelligence';\n/, '');
content = content.replace(/import AnalyticsDashboard from '.\/components\/AnalyticsDashboard';\n/, '');

// Remove routes
content = content.replace(/<Route path="\/patrols" element=\{<PatrolUnits \/>\} \/>\n/, '');
content = content.replace(/<Route path="\/risk" element=\{<RiskDashboard \/>\} \/>\n/, '');
content = content.replace(/<Route path="\/satellite" element=\{<SatelliteIntelligence \/>\} \/>\n/, '');
content = content.replace(/<Route path="\/analytics" element=\{<AnalyticsDashboard \/>\} \/>\n/, '');

fs.writeFileSync('src/App.tsx', content);
