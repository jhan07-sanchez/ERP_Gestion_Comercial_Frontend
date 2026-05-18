import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.resolve(__dirname, '../src');

// Function to recursively find all files in a directory
function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.jsx') || file.endsWith('.js')) {
        arrayOfFiles.push(path.join(dirPath, "/", file));
      }
    }
  });

  return arrayOfFiles;
}

const files = getAllFiles(srcDir);
let changedFiles = 0;

files.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Replace font sizes
  content = content.replace(/text-\[9px\]/g, 'text-xs opacity-80');
  content = content.replace(/text-\[10px\]/g, 'text-xs');
  content = content.replace(/text-\[11px\]/g, 'text-xs');
  content = content.replace(/text-\[12px\]/g, 'text-xs');
  content = content.replace(/text-\[13px\]/g, 'text-sm');
  content = content.replace(/text-\[14px\]/g, 'text-sm');
  content = content.replace(/text-\[15px\]/g, 'text-base');
  content = content.replace(/text-\[16px\]/g, 'text-base');
  content = content.replace(/text-\[18px\]/g, 'text-lg');
  content = content.replace(/text-\[20px\]/g, 'text-xl');
  content = content.replace(/text-\[24px\]/g, 'text-2xl');

  // Replace heights/widths
  content = content.replace(/w-\[140px\]/g, 'w-36');
  content = content.replace(/w-\[150px\]/g, 'w-40');
  content = content.replace(/w-\[200px\]/g, 'w-52');
  content = content.replace(/max-w-\[150px\]/g, 'max-w-40');
  content = content.replace(/max-w-\[200px\]/g, 'max-w-xs');
  content = content.replace(/max-w-\[140px\]/g, 'max-w-36');
  content = content.replace(/min-w-\[100px\]/g, 'min-w-28');
  content = content.replace(/min-h-\[400px\]/g, 'min-h-96');
  content = content.replace(/min-h-\[500px\]/g, 'min-h-[32rem]');
  content = content.replace(/max-w-\[1600px\]/g, 'max-w-screen-2xl');

  // Padding / Margin replaces
  content = content.replace(/py-\[7px\]/g, 'py-2');
  content = content.replace(/px-\[15px\]/g, 'px-4');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    changedFiles++;
    console.log(`Updated ${path.basename(filePath)}`);
  }
});

console.log(`\nSuccessfully updated ${changedFiles} files to remove arbitrary Tailwind sizes.`);
