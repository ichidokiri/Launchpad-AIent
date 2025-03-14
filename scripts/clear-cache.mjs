import { rm, existsSync } from 'fs';
import { join } from 'path';

// Paths to clear
const pathsToClear = [
  '.next',
  'node_modules/.cache'
];

async function clearCache() {
  try {
    for (const pathToClear of pathsToClear) {
      const fullPath = join(process.cwd(), pathToClear);
      
      if (existsSync(fullPath)) {
        console.log(`Clearing ${pathToClear}...`);
        await rm(fullPath, { recursive: true, force: true });
        console.log(`✅ Cleared ${pathToClear}`);
      } else {
        console.log(`⚠️ Path ${pathToClear} does not exist, skipping.`);
      }
    }
    
    console.log('✨ Cache cleared successfully!');
  } catch (error) {
    console.error('Error clearing cache:', error);
    process.exit(1);
  }
}

clearCache();

