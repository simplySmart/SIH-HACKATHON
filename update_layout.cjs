const fs = require('fs');

let app = fs.readFileSync('src/App.tsx', 'utf8');
app = app.replace(
  "import MobileHeader from './components/MobileHeader';",
  "import Header from './components/Header';"
);
app = app.replace(
  "export default function App() {",
  "import { useState } from 'react';\n\nexport default function App() {\n  const [isSidebarOpen, setIsSidebarOpen] = useState(false);"
);
app = app.replace(
  "<Sidebar />\n      <MobileHeader />",
  "<Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />\n      <Header onMenuClick={() => setIsSidebarOpen(true)} />"
);
// Remove md:ml-64 because sidebar is now an overlay/hamburger
app = app.replace("md:ml-64 px-4 pt-20", "px-4 pt-20");

fs.writeFileSync('src/App.tsx', app);
