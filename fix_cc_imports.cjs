const fs = require('fs');
let content = fs.readFileSync('src/components/CommandCenter.tsx', 'utf8');

// Undo the mess
content = content.replace(/import \{ PlayCircle,/g, 'import {');
content = content.replace(/import \{ PlayCircle, PlayCircle,/g, 'import {');

// Put it back in the right place
content = content.replace(/import \{\n?  RefreshCw/g, 'import {\n  PlayCircle,\n  RefreshCw');
content = content.replace(/import \{ RefreshCw/g, 'import { PlayCircle, RefreshCw');

fs.writeFileSync('src/components/CommandCenter.tsx', content);
