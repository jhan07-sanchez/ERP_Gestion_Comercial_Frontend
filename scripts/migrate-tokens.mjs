/**
 * 🔄 SCRIPT DE MIGRACIÓN DE TOKENS DE DISEÑO
 * 
 * Reemplaza TODAS las clases por defecto de Tailwind con los tokens
 * del sistema de diseño definidos en tailwind.config.js.
 * 
 * MAPEO:
 * - blue-*    → accent-*   (color de acción principal)
 * - gray-*    → primary-*  (neutrales)
 * - slate-*   → primary-*  (neutrales)
 * - green-*   → success-*  (estados positivos)
 * - emerald-* → success-*  (estados positivos)
 * - red-*     → danger-*   (errores/destructivo)
 * - rose-*    → danger-*   (errores/destructivo)
 * - yellow-*  → warning-*  (advertencias)
 * - amber-*   → warning-*  (advertencias)
 * - indigo-*  → accent-*   (acción secundaria)
 * 
 * USO:
 *   node scripts/migrate-tokens.mjs
 */

import { readdir, readFile, writeFile } from 'fs/promises';
import { join, extname } from 'path';

const SRC_DIR = join(process.cwd(), 'src');

const REPLACEMENTS = [
  // Orden: nombres más largos primero para evitar conflictos parciales
  { pattern: /emerald-(\d{2,3})/g, replace: 'success-$1' },
  { pattern: /indigo-(\d{2,3})/g, replace: 'accent-$1' },
  { pattern: /green-(\d{2,3})/g, replace: 'success-$1' },
  { pattern: /amber-(\d{2,3})/g, replace: 'warning-$1' },
  { pattern: /yellow-(\d{2,3})/g, replace: 'warning-$1' },
  { pattern: /slate-(\d{2,3})/g, replace: 'primary-$1' },
  { pattern: /rose-(\d{2,3})/g, replace: 'danger-$1' },
  { pattern: /blue-(\d{2,3})/g, replace: 'accent-$1' },
  { pattern: /gray-(\d{2,3})/g, replace: 'primary-$1' },
  { pattern: /red-(\d{2,3})/g, replace: 'danger-$1' },
];

const VALID_EXTENSIONS = new Set(['.tsx', '.ts', '.jsx', '.js']);

async function getAllFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.git') continue;
      files.push(...await getAllFiles(fullPath));
    } else if (VALID_EXTENSIONS.has(extname(entry.name))) {
      files.push(fullPath);
    }
  }

  return files;
}

async function migrateFile(filePath) {
  let content = await readFile(filePath, 'utf-8');
  const original = content;

  for (const { pattern, replace } of REPLACEMENTS) {
    content = content.replace(pattern, replace);
  }

  if (content !== original) {
    await writeFile(filePath, content, 'utf-8');
    const relativePath = filePath.replace(process.cwd(), '').replace(/\\/g, '/');
    console.log(`  ✅ ${relativePath}`);
    return true;
  }
  return false;
}

async function main() {
  console.log('');
  console.log('🎨 Migración de Tokens de Diseño');
  console.log('═'.repeat(50));
  console.log('');

  const files = await getAllFiles(SRC_DIR);
  console.log(`📁 Escaneando ${files.length} archivos en src/...`);
  console.log('');

  let modified = 0;
  for (const file of files) {
    if (await migrateFile(file)) modified++;
  }

  console.log('');
  console.log('═'.repeat(50));
  console.log(`✨ Completado: ${modified} archivos actualizados de ${files.length} escaneados.`);
  console.log('');
}

main().catch(console.error);
