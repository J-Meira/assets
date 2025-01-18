import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

/*
 * This file is part of JM Creative Assets.
 *
 * JM Creative Assets is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * JM Creative Assets is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with JM Creative Assets. If not, see <https://www.gnu.org/licenses/>.
 */

dotenv.config();

/**
 * Helper function to get files from a directory
 * @param dir - The directory to scan
 * @returns An array of file names
 */
function getFilesFromDirectory(dir: string): string[] {
  return fs
    .readdirSync(dir)
    .filter((file) => fs.statSync(path.join(dir, file)).isFile());
}

/**
 * Main function to generate the content.json
 * @param tagVersion - The version to set in the JSON file
 */
function generateFilesJson(tagVersion: string): void {
  const directoryPath = path.resolve(__dirname, 'files');
  const outputPath = path.resolve(__dirname, 'public/content.json');

  const files = getFilesFromDirectory(directoryPath);

  const jsonData = {
    version: tagVersion,
    files: files,
  };

  fs.writeFileSync(outputPath, JSON.stringify(jsonData, null, 2), 'utf8');

  console.log(
    `Generated files.json for version ${tagVersion} with ${files.length} files.`,
  );
}

const tagName = process.env.TAG_NAME;

if (!tagName) {
  console.error('Error: TAG_NAME environment variable is not set');
  process.exit(1);
}

generateFilesJson(tagName);
