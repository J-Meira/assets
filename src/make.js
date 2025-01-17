const fs = require('fs');
const path = require('path');

// Get the tag version from command-line arguments
const tagVersion = process.argv[2];
if (!tagVersion) {
  console.error('Error: No version provided');
  process.exit(1);
}

// Paths
const directoryPath = path.resolve(__dirname, 'files'); // Directory to scan
const outputPath = path.resolve(__dirname, 'public/content.json'); // JSON file to write

// Helper function to get the folder's files
function getFilesFromDirectory(dir) {
  return fs.readdirSync(dir).filter((file) => fs.statSync(path.join(dir, file)).isFile());
}

// Get all files in the directory
const files = getFilesFromDirectory(directoryPath);

// Generate the JSON content
const jsonData = {
  version: tagVersion, // Use the tag version
  files: files,
};

// Write the JSON to the output file
fs.writeFileSync(outputPath, JSON.stringify(jsonData, null, 2), 'utf8');

console.log(`Generated content.json for version ${tagVersion} with ${files.length} files.`);
