'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
var mongoose = require('mongoose');
var http=require('http');


// Controllers
var imageController = require('./controllers/image');
//const uri = "mongodb://admin:admin@127.0.0.1:27017/?authSource=admin&readPreference=primary&ssl=false";

mongoose.connect('mongodb://admin:admin@127.0.0.1:27017/test_db?authSource=admin');
mongoose.connection.on('error', function(err) {
  console.log('MongoDB Connection Error. Please make sure that MongoDB is running.'+err);
  process.exit(1);
});


// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

//storage for images
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, 'uploads/');
  },

  // By default, multer removes file extensions so let's add them back
  filename: function(req, file, cb) {
      cb(null, file.originalname);
  }
});
const upload = multer({storage: storage});

app.get('/Hello', (req, res) => {
  res.send('Hello');
});


app.get('/view',  imageController.imageGet);
app.post('/upload',upload.single('pic'),imageController.uploadPhoto);
app.delete('/del', imageController.uploadPhoto);


app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);