const Photo = require('../models/Photo'); // Import the Photo model
const { ObjectId } = require('mongoose').Types;
const fs = require('fs');


// GET /api/photos
const getPhotos = async (req, res) => {
  try {
    const photos = await Photo.find().sort({ _id: -1 });
    res.json(photos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/photos/:id
const deletePhoto = async (req, res) => {
    const { id } = req.params;
  
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid photo ID' });
    }
  
    try {
      const deletedPhoto = await Photo.findByIdAndRemove(id);
  
      if (!deletedPhoto) {
        return res.status(404).json({ error: 'Photo not found' });
      }
  
      // Delete the corresponding file from the 'uploads/' directory
      const filePath = `uploads/${deletedPhoto.filename}`;
      fs.unlinkSync(filePath);
  
      res.json({ message: 'Photo deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

module.exports = {
  getPhotos,
  deletePhoto,
};
