import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const LOGOS_DIR = '/Users/admino/Documents/PROJECTS/Project_profi-deutsch-website/v0/Testing/german-language-center_v84/public/images/logos';

async function convertSvgToPng() {
  const files = await fs.readdir(LOGOS_DIR);
  const svgFiles = files.filter(file => file.endsWith('.svg'));

  for (const svgFile of svgFiles) {
    const svgPath = path.join(LOGOS_DIR, svgFile);
    const pngPath = path.join(LOGOS_DIR, svgFile.replace('.svg', '.png'));
    const svgContent = await fs.readFile(svgPath);
    
    await sharp(svgContent)
      .resize(200, 60)
      .png()
      .toFile(pngPath);
    
    console.log(`Converted ${svgFile} to PNG`);
  }
}

convertSvgToPng().catch(console.error);
