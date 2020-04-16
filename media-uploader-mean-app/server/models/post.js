const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  text:{
    type: String,
    required: [true, 'Name is required']
  },
  media:{
    type: [String], 
    required: [true, 'Media is required']
  }
});

const post = mongoose.model('post',postSchema);

module.exports = post;