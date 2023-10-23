const axios = require('axios');
const path = require('path');
const fs = require('fs');
const Photo = require('../models/Photo');

const addPhotoFromURL = async (req, res) => {
  const { url } = req.body;
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const fileExtension = path.extname(url);
    const filename = `url-${Date.now()}${fileExtension}`;

    fs.writeFileSync(`uploads/${filename}`, response.data);

    const photo = new Photo({ filename, source: 'url' });
    await photo.save();

    res.status(201).json(photo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addPhotoFromURL,
};
