var Image = require("../models/image");
var queue = require("./queue");
var mongoose = require("mongoose");
var fs = require("fs");
var path = require("path");

//found out this nice LRU cache for saving image data
var LRU = require("lru-cache")
  , options = { max: 10
              , length: function (n, key) { return n * 2 + key.length }
              , dispose: function (key, n) { n.close() }
              , maxAge: 1000 * 60 * 60 }
  , cache = new LRU(options)
  , otherCache = new LRU(50) // sets just the max size

const fileType = require("file-type");

var root =  path.join(__dirname);

exports.getPhoto = async function(req, res) 
{
    try
    {
        image_name = await Image.findOne({ name: req.query.name });
        if ("name" in image_name)
        {
            image_full_path = root + "/../uploads/" + image_name.name;
            // fin d if image is cached
            var data = cache.get(image_name.name);

            if(data)
            {
                //if cached then fethc from the LRU
                var img = Buffer.from(data, 'base64');

                res.writeHead(200, {
                    'Content-Type': 'image/png',
                    'Content-Length': img.length
                });
                res.end(img);
            } else {
                fs.readFile(image_full_path, (err, data)=>{
                    cache.set(image_name.name, data);
                    res.sendFile(path.resolve(image_full_path));
                });
            }
            
        }
        //queue.sendQueue('get',"guy read");

    } catch (e) {
        res.send(e.message);
    }
};

exports.uploadPhoto = async function(req, res) {
    try
    {
        var image = new Image();
        image.name = req.file.originalname;
        await image.save();
        //queue.sendQueue('upload',"guy upload");
        res.send("Image saved");
    } catch(e) {
        res.send(e.message);
    }
  };

  exports.delPhoto = async function(req, res) {
    try
    {
        image_full_path = root + "/../uploads/" + req.query.name;
        fs.unlinkSync(image_full_path);
        cache.del(req.query.name);
        image = await Image.deleteOne({ name: req.query.name });
        //queue.sendQueue('del',"guy delete");
        res.send("Image deleted");
    } catch(e) {
        res.send(e.message);
    }
  };
