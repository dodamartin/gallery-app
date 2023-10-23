const Photo = require('../models/Photo');

const uploadPhoto = async (req, res) => {
  const { filename } = req.file;
  const photo = new Photo({ filename, source: 'upload' });

  try {
    await photo.save();
    res.status(201).json(photo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  uploadPhoto,
};
