const mongoose = require('mongoose');

// Define the Photo schema
const photoSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    enum: ['upload', 'url'],
    required: true,
  },
});

// Create the Photo model
const Photo = mongoose.model('Photo', photoSchema);

module.exports = Photo;
