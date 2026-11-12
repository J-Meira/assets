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

/**
 * Group file paths by their folder, keeping the root group first.
 * @param {string[]} files - Paths relative to the assets root
 * @returns {Map<string, string[]>} folder -> file paths ("" for root)
 */
function groupByFolder(files) {
  const groups = new Map([['', []]]);
  files.forEach((file) => {
    const index = file.lastIndexOf('/');
    const folder = index === -1 ? '' : file.slice(0, index);
    if (!groups.has(folder)) groups.set(folder, []);
    groups.get(folder).push(file);
  });
  return groups;
}

/**
 * Build a list element with one download link per file.
 * @param {string[]} files
 * @returns {HTMLUListElement}
 */
function createFileList(files) {
  const list = document.createElement('ul');
  files.forEach((file) => {
    const name = file.split('/').pop();
    const listItem = document.createElement('li');
    const link = document.createElement('a');
    link.href = `./${file}`;
    link.textContent = name;
    link.download = name;
    listItem.appendChild(link);
    list.appendChild(listItem);
  });
  return list;
}

fetch('./content.json')
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    const { version, files } = data;

    const versionElement = document.getElementById('version');
    versionElement.textContent = `Version: ${version}`;

    const container = document.getElementById('file-list');
    groupByFolder(files).forEach((groupFiles, folder) => {
      if (groupFiles.length === 0) return;
      const section = document.createElement('section');
      section.className = 'folder';
      if (folder) {
        const heading = document.createElement('h4');
        heading.textContent = `${folder}/`;
        section.appendChild(heading);
      }
      section.appendChild(createFileList(groupFiles));
      container.appendChild(section);
    });
  })
  .catch((error) => {
    console.error('Error fetching file list:', error);
  });
