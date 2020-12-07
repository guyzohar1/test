var Image = require("../models/image");
var queue = require("./queue");
var mongoose = require("mongoose");
var fs = require("fs");
var path = require("path");

const fileType = require("file-type");

var root =  path.join(__dirname);

exports.imageGet = async function(req, res) 
{
    try
    {
        image = await Image.findOne({ name: req.query.name });
        if ("name" in image)
        {
            res.sendFile(path.resolve(root + "/../uploads/" + image.name));
        }
        queue.sendQueue('get',"guy read");

    } catch (e) {
        res.send("unable to find pic");
    }
};

exports.uploadPhoto = async function(req, res) {
    try
    {
        var image = new Image();
        image.name = req.file.originalname;
        image.save();
        queue.sendQueue('upload',"guy upload");
        res.send("Image saved");
    } catch(e) {
        res.send("unable to save image");
    }
  };

  exports.delPhoto = async function(req, res) {
    try
    {
        try 
        {
            fs.unlinkSync(req.query.name);
            image = await Image.deleteOne({ name: req.query.name });
            queue.sendQueue('del',"guy delete");
        } catch (err) {
            res.send("File not exists")
        }
        res.send("Image deleted");
    } catch(e) {
        res.send("unable to delete image");
    }
  };
