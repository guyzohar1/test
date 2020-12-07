var mongoose = require('mongoose');


var schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  }
};

var imagesSchema = new mongoose.Schema({
  name: { type: String, unique: true},
  }, schemaOptions);
var Image = mongoose.model('Images', imagesSchema);
module.exports = Image;