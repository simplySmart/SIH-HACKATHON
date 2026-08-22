const fs = require('fs');

let content = fs.readFileSync('src/components/Alerts.tsx', 'utf8');

// Fix header layout
content = content.replace(
  '<header className="flex justify-between items-center mb-6 shrink-0">',
  '<header className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4 mb-6 shrink-0">'
);
content = content.replace(
  '<div className="flex gap-4 items-center">',
  '<div className="flex flex-wrap gap-2 md:gap-4 items-center">'
);

// Fix metrics layout
content = content.replace(
  '<div className="flex md:grid grid-cols-2 md:grid-cols-5 gap-4 mb-6 shrink-0 overflow-x-auto pb-2 snap-x">',
  '<div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 md:gap-4 mb-6 shrink-0">'
);

// Remove min-w on metrics cards to allow normal grid resizing
content = content.replace(/min-w-\[120px\] snap-center/g, '');

fs.writeFileSync('src/components/Alerts.tsx', content);
