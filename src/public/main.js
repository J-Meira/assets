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

fetch('./content.json')
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    const { version, files } = data;
    console.log(`Files Version: ${version}`);

    const versionElement = document.getElementById('version');
    versionElement.textContent = `Version: ${version}`;
    const fileList = document.getElementById('file-list');
    files.forEach((file) => {
      const listItem = document.createElement('li');
      const link = document.createElement('a');
      link.href = `./${file}`;
      link.textContent = file;
      link.download = file;
      listItem.appendChild(link);
      fileList.appendChild(listItem);
    });
  })
  .catch((error) => {
    console.error('Error fetching file list:', error);
  });
