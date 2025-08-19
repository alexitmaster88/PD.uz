#!/bin/bash

LOGOS_DIR="/Users/admino/Documents/PROJECTS/Project_profi-deutsch-website/v0/Testing/german-language-center_v84/public/images/logos"

# Create Goethe Institut Logo
cat > "$LOGOS_DIR/goethelogo.svg" << 'EOL'
<?xml version="1.0" encoding="UTF-8"?>
<svg width="200" height="60" viewBox="0 0 200 60" version="1.1" xmlns="http://www.w3.org/2000/svg">
  <style>.text-blue{fill:#00B4E5;}</style>
  <g>
    <rect class="text-blue" x="10" y="15" width="30" height="5"/>
    <rect class="text-blue" x="10" y="25" width="30" height="5"/>
    <rect class="text-blue" x="10" y="35" width="30" height="5"/>
    <text x="50" y="30" class="text-blue" font-family="Arial" font-size="18" font-weight="700">GOETHE</text>
    <text x="50" y="45" class="text-blue" font-family="Arial" font-size="18">INSTITUT</text>
  </g>
</svg>
EOL

# Create DAAD Logo
cat > "$LOGOS_DIR/daadlogo.svg" << 'EOL'
<?xml version="1.0" encoding="UTF-8"?>
<svg width="200" height="60" viewBox="0 0 200 60" version="1.1" xmlns="http://www.w3.org/2000/svg">
  <style>.text-blue{fill:#00457C;}</style>
  <g>
    <text x="20" y="35" class="text-blue" font-family="Arial" font-size="28" font-weight="700">DAAD</text>
    <line x1="20" y1="40" x2="180" y2="40" stroke="#00457C" stroke-width="2"/>
    <text x="20" y="55" class="text-blue" font-family="Arial" font-size="12">Deutscher Akademischer Austauschdienst</text>
  </g>
</svg>
EOL

# Create BMZ Logo
cat > "$LOGOS_DIR/bmzlogo.svg" << 'EOL'
<?xml version="1.0" encoding="UTF-8"?>
<svg width="200" height="60" viewBox="0 0 200 60" version="1.1" xmlns="http://www.w3.org/2000/svg">
  <style>.text-red{fill:#C8102E;}</style>
  <g>
    <text x="20" y="35" class="text-red" font-family="Arial" font-size="28" font-weight="700">BMZ</text>
    <text x="20" y="50" class="text-red" font-family="Arial" font-size="10">Bundesministerium für wirtschaftliche</text>
    <text x="20" y="58" class="text-red" font-family="Arial" font-size="10">Zusammenarbeit und Entwicklung</text>
  </g>
</svg>
EOL

# Create GIZ Logo
cat > "$LOGOS_DIR/gizlogo.svg" << 'EOL'
<?xml version="1.0" encoding="UTF-8"?>
<svg width="200" height="60" viewBox="0 0 200 60" version="1.1" xmlns="http://www.w3.org/2000/svg">
  <style>.text-red{fill:#C8102E;}</style>
  <g>
    <text x="20" y="40" class="text-red" font-family="Arial" font-size="32" font-weight="700">GIZ</text>
    <text x="20" y="55" class="text-red" font-family="Arial" font-size="12">Deutsche Gesellschaft für</text>
  </g>
</svg>
EOL

# Create Siemens Logo
cat > "$LOGOS_DIR/siemenslogo.svg" << 'EOL'
<?xml version="1.0" encoding="UTF-8"?>
<svg width="200" height="60" viewBox="0 0 200 60" version="1.1" xmlns="http://www.w3.org/2000/svg">
  <style>.text-teal{fill:#009999;}</style>
  <g>
    <text x="20" y="40" class="text-teal" font-family="Arial" font-size="32" font-weight="700">SIEMENS</text>
  </g>
</svg>
EOL

# Create Volkswagen Logo
cat > "$LOGOS_DIR/volkswagenlogo.svg" << 'EOL'
<?xml version="1.0" encoding="UTF-8"?>
<svg width="200" height="60" viewBox="0 0 200 60" version="1.1" xmlns="http://www.w3.org/2000/svg">
  <style>.text-blue{fill:#001E50;}</style>
  <circle cx="100" cy="30" r="25" fill="none" stroke="#001E50" stroke-width="2"/>
  <path d="M85 30l15-15 15 15-15 15z" class="text-blue"/>
  <text x="75" y="55" class="text-blue" font-family="Arial" font-size="12">VOLKSWAGEN</text>
</svg>
EOL

# Create Bosch Logo
cat > "$LOGOS_DIR/boschlogo.svg" << 'EOL'
<?xml version="1.0" encoding="UTF-8"?>
<svg width="200" height="60" viewBox="0 0 200 60" version="1.1" xmlns="http://www.w3.org/2000/svg">
  <style>.text-red{fill:#E20015;}</style>
  <g>
    <text x="20" y="40" class="text-red" font-family="Arial" font-size="32" font-weight="700">BOSCH</text>
  </g>
</svg>
EOL

# Create SAP Logo
cat > "$LOGOS_DIR/saplogo.svg" << 'EOL'
<?xml version="1.0" encoding="UTF-8"?>
<svg width="200" height="60" viewBox="0 0 200 60" version="1.1" xmlns="http://www.w3.org/2000/svg">
  <style>.text-blue{fill:#0066B1;}</style>
  <g>
    <text x="20" y="40" class="text-blue" font-family="Arial" font-size="32" font-weight="700">SAP</text>
  </g>
</svg>
EOL

# Create Lufthansa Logo
cat > "$LOGOS_DIR/lufthansalogo.svg" << 'EOL'
<?xml version="1.0" encoding="UTF-8"?>
<svg width="200" height="60" viewBox="0 0 200 60" version="1.1" xmlns="http://www.w3.org/2000/svg">
  <style>
    .crane{fill:#05164D;}
    .text{fill:#05164D;}
  </style>
  <g>
    <circle cx="30" cy="30" r="20" class="crane"/>
    <text x="60" y="40" class="text" font-family="Arial" font-size="24" font-weight="700">Lufthansa</text>
  </g>
</svg>
EOL
