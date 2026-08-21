const fs = require('fs');
let content = fs.readFileSync('src/components/MobileBottomNav.tsx', 'utf8');

content = content.replace(/import \{ PlayCircle,/g, 'import {');
content = content.replace(/import \{ Radio, PlayCircle,/g, 'import { Radio,');
content = content.replace(/import \{ PlayCircle, Radio,/g, 'import { Radio,');
content = content.replace(/import \{\n  Home/g, "import {\n  PlayCircle,\n  Home");

fs.writeFileSync('src/components/MobileBottomNav.tsx', content);
