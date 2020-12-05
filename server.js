'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');


const uri = "mongodb://admin:admin@127.0.0.1:27017/?authSource=admin&readPreference=primary&ssl=false";

async function con()
{
  try {
    // Connect to the MongoDB cluster
    var client = require('mongodb').MongoClient;
    var db = await client.connect(uri);

    var dbo = db.db("test_db");
    await dbo.createCollection("images");
    console.log("Collection created!");

  } catch (e) {
    console.error(e);
  } 
}


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

app.post('/LoadImage',upload.single('pic'), async(req, res) => {

  if (!req.file) {
      return res.send('Please select an image to upload');
  }
  
  try{
    var client = require('mongodb').MongoClient;
    var db = await client.connect(uri);

    var dbo = db.db("test_db");
    var myobj = { name:req.file.originalname, location: "public/" + req.file.originalname };
    await dbo.collection("Images").insertOne(myobj);
    res.send("Image " + req.file.originalname  + " inserted");
  } catch (e) {
    res.send("Unable to load image name");
  } 
});

app.get('/ViewImages', async (req, res) => {
  var client = require('mongodb').MongoClient;

  try
  {
    var db = await client.connect(uri);

    var dbo = db.db("test_db");
    var images = await dbo.collection("Images").find().toArray();
    res.send(images);
  } catch (e) {
    res.send("Unable to get images name");
  } 

});

app.delete('/DelImage', async (req, res) => {

  var req_name = params.name;
  try {
    fs.unlinkSync(params.name);
  } catch (err) {
    res.send("File not exists")
  }

  try{
    var client = require('mongodb').MongoClient;
    var db = await client.connect(uri);

    var dbo = db.db("test_db");
    var myobj = { name: params.name};
    await dbo.collection("Images").deleteOne(myobj);
    res.send("Image " +params.name + " deleted");
  } catch (e) {
    res.send("Unable to Del image name");
  } 
  
  
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);