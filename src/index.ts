import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

/*
 * This file is part of JM.App Assets.
 *
 * JM.App Assets is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * JM.App Assets is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with JM.App Assets. If not, see <https://www.gnu.org/licenses/>.
 */

dotenv.config();

/** Project root (this file is compiled to dist/, so go one level up) */
const ROOT_DIR = path.resolve(__dirname, '..');

/** OS metadata files that should never be published */
const IGNORED_FILES = new Set(['Thumbs.db', 'desktop.ini']);

/**
 * Whether a directory entry should be left out of the listing
 * @param name - The entry name
 * @returns true for hidden entries (starting with ".") and known junk files
 */
function isIgnored(name: string): boolean {
  return name.startsWith('.') || IGNORED_FILES.has(name);
}

/**
 * Helper function to recursively get files from a directory
 * @param dir - The directory to scan
 * @param base - The root directory used to build relative paths
 * @returns An array of file paths relative to the root, using '/' separators
 */
function getFilesFromDirectory(dir: string, base: string = dir): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  const dirs: string[] = [];

  for (const entry of entries) {
    if (isIgnored(entry.name)) continue;

    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      dirs.push(fullPath);
    } else if (entry.isFile()) {
      files.push(path.relative(base, fullPath).split(path.sep).join('/'));
    }
  }

  files.sort((a, b) => a.localeCompare(b));
  dirs.sort((a, b) => a.localeCompare(b));

  for (const subDir of dirs) {
    files.push(...getFilesFromDirectory(subDir, base));
  }

  return files;
}

/**
 * Main function to generate the content.json
 * @param tagVersion - The version to set in the JSON file
 */
function generateContentJson(tagVersion: string): void {
  const directoryPath = path.join(ROOT_DIR, 'src', 'files');
  const outputPath = path.join(ROOT_DIR, 'src', 'public', 'content.json');

  const files = getFilesFromDirectory(directoryPath);

  const jsonData = {
    version: tagVersion,
    files: files,
  };

  fs.writeFileSync(outputPath, JSON.stringify(jsonData, null, 2), 'utf8');

  console.log(
    `Generated content.json for version ${tagVersion} with ${files.length} files.`,
  );
}

const tagName = process.env.TAG_NAME;

if (!tagName) {
  console.error('Error: TAG_NAME environment variable is not set');
  process.exit(1);
}

generateContentJson(tagName);
