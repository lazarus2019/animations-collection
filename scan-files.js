import fs from 'fs';
import path from 'path';

// Generate by AI, will read later =]]

const SKIPPED_FILES = ['index.html'];

/**
 * Recursively collect all files under a folder
 * @param {string} dir - the directory to start from
 * @returns {string[]} all file paths, flattened
 */
function getAllFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getAllFiles(fullPath)); // recurse
    } else {
      files.push(fullPath); // add file
    }
  }

  return files;
}

// Run
const root = process.cwd(); // your repo root
const allFiles = getAllFiles(root)
  // make them relative (not absolute)
  .map((f) => path.relative(root, f))
  // filter if you only want .html files
  .filter((f) => f.endsWith('.html') && !SKIPPED_FILES.includes(f));

console.log('All html files:', allFiles);

function generateKeyFolderValueFilePath(allFiles) {
  const result = {};
  allFiles.forEach((filePath) => {
    const parts = filePath.split(path.sep);
    const folder =
      parts.length > 1 ? parts.slice(0, -1).join(path.sep) : 'root';
    if (!result[folder]) {
      result[folder] = [];
    }
    result[folder].push(filePath);
  });

  return result;
}

const output = generateKeyFolderValueFilePath(allFiles);

console.log('Generated output:', output);

// save to html-paths.json
fs.writeFileSync(
  path.join(root, 'html-paths.json'),
  JSON.stringify(output, null, 2)
);

console.log(`Found and saved ${allFiles.length} HTML files to html-paths.json`);
