const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const path = require('path');
const app = express();
const cors = require('cors');
const fs = require('fs');
const { ObjectId } = require('mongoose').Types;
require('dotenv').config();

const { upload } = require('./middleware');
const photosController = require('./controllers/photosController');
const uploadController = require('./controllers/uploadController');
const addFromUrlController = require('./controllers/addFromUrlController');

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.DB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/uploads', express.static('uploads'));

app.get('/api/photos', photosController.getPhotos);
app.delete('/api/photos/:id', photosController.deletePhoto);

app.post('/api/upload', upload.single('photo'), uploadController.uploadPhoto);
app.post('/api/add-from-url', addFromUrlController.addPhotoFromURL);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
