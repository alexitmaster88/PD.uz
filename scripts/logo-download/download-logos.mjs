import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';

const LOGOS = [
  {
    name: 'goethe',
    png: 'https://www.goethe.de/resources/files/images/logo-goethe-institut.png',
    svg: 'https://www.goethe.de/resources/files/svg/logo-goethe-institut.svg'
  },
  {
    name: 'daad',
    png: 'https://www.daad.de/assets/logos/daad-logo.png',
    svg: 'https://www.daad.de/assets/logos/daad-logo.svg'
  },
  {
    name: 'bmz',
    png: 'https://www.bmz.de/static/img/bmz-logo-en.png',
    svg: 'https://www.bmz.de/static/img/bmz-logo-en.svg'
  },
  {
    name: 'giz',
    png: 'https://www.giz.de/static/media/giz-logo.png',
    svg: 'https://www.giz.de/static/media/giz-logo.svg'
  },
  {
    name: 'siemens',
    png: 'https://www.siemens.com/logo.png',
    svg: 'https://www.siemens.com/logo.svg'
  },
  {
    name: 'volkswagen',
    png: 'https://www.volkswagen.com/vw-logo.png',
    svg: 'https://www.volkswagen.com/vw-logo.svg'
  },
  {
    name: 'bosch',
    png: 'https://www.bosch.com/bosch-logo.png',
    svg: 'https://www.bosch.com/bosch-logo.svg'
  },
  {
    name: 'sap',
    png: 'https://www.sap.com/logo.png',
    svg: 'https://www.sap.com/logo.svg'
  },
  {
    name: 'lufthansa',
    png: 'https://www.lufthansa.com/logo.png',
    svg: 'https://www.lufthansa.com/logo.svg'
  }
];

const downloadFile = async (url, outputPath) => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch ${url}`);
    const buffer = await response.buffer();
    await fs.writeFile(outputPath, buffer);
    console.log(`Downloaded: ${outputPath}`);
  } catch (error) {
    console.error(`Error downloading ${url}:`, error.message);
  }
};

const main = async () => {
  const outputDir = path.join(process.cwd(), 'public', 'images', 'logos');
  await fs.mkdir(outputDir, { recursive: true });

  for (const logo of LOGOS) {
    const pngPath = path.join(outputDir, `${logo.name}logo.png`);
    const svgPath = path.join(outputDir, `${logo.name}logo.svg`);
    
    await Promise.all([
      downloadFile(logo.png, pngPath),
      downloadFile(logo.svg, svgPath)
    ]);
  }
};

main().catch(console.error);
