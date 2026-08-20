import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const directoryPath = path.join(__dirname, 'public', 'Products');

async function compressImages() {
  try {
    const files = fs.readdirSync(directoryPath);
    
    for (const file of files) {
      if (file.endsWith('.png') || file.endsWith('.jpg')) {
        const filePath = path.join(directoryPath, file);
        const tempFilePath = path.join(directoryPath, `temp_${file}`);
        
        console.log(`Compressing ${file}...`);
        
        // Resize to max 800px width and compress PNG aggressively
        await sharp(filePath)
          .resize(800, null, { withoutEnlargement: true })
          .png({ quality: 60, compressionLevel: 9 })
          .toFile(tempFilePath);
          
        // Overwrite original
        fs.unlinkSync(filePath);
        fs.renameSync(tempFilePath, filePath);
        
        const stats = fs.statSync(filePath);
        console.log(`Finished ${file}. New size: ${(stats.size / 1024).toFixed(2)} KB`);
      }
    }
    console.log("All local images compressed successfully!");
  } catch (err) {
    console.error("Compression error:", err);
  }
}

compressImages();
