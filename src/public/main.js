// Fetch the JSON file and populate the list
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
