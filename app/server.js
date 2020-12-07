'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
var mongoose = require('mongoose');
var http=require('http');


// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// Controllers
var imageController = require('./controllers/image');
var limiter = require("./middleware/ratelimiter");

//setup mongoDB
mongoose.connect('mongodb://admin:admin@localhost:27017/test_db?authSource=admin');
mongoose.connection.on('error', function(err) {
  console.log('MongoDB Connection Error. Please make sure that MongoDB is running.'+err);
  process.exit(1);
});

//storage for images
var root =  path.join(__dirname);
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, root + '/uploads/');
  },

  // By default, multer removes file extensions so let's add them back
  filename: function(req, file, cb) {
      cb(null, file.originalname);
  }
});
const upload = multer({storage: storage});

// App
const app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

app.get('/Hello', (req, res) => {
  res.send('Hello');
});


app.get('/view',  limiter.imageRateLimiter, imageController.getPhoto);
app.post('/upload',upload.single('pic'),imageController.uploadPhoto);
app.delete('/del', imageController.delPhoto);


app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);