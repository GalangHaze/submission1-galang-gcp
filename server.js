host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0'

const express = require('express');
const { Storage } = require('@google-cloud/storage');
const app = express();
const storage = new Storage();

app.get('/', async (req, res) => {
  const bucketName = 'submission-galang-01';
  const fileNames = ['Anime NFT.jpg', 'Jong Unch.png', 'NFT 1.png', 'NFT 2.png', 'download.png'];
  const promises = [];

  for (const fileName of fileNames) {
    const file = storage.bucket(bucketName).file(fileName);
    const fileExists = await file.exists();

    if (fileExists[0]) {
      promises.push(file.getSignedUrl({
        action: 'read',
        expires: '03-17-2025' // Tanggal kadaluarsa URL
      }));
    }
  }

  const urls = await Promise.all(promises);

  let html = '<html><body>';

  for (const url of urls) {
    html += `<img src="${url}" /><br>`;
  }

  html += '</body></html>';
  res.send(html);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
