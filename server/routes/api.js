const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const posts = require('../models/post');
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const { pipeline, Transform, Readable } = require('stream');

Transform.prototype._transform = function (chunk, enc, cb) {
  this.push(chunk);
  cb();
};

let uri = 'mongodb://localhost/posts';

const upload = multer();

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  keepAlive: true
});

const conn = mongoose.connection;

let gfs;
conn.once("open", () => {
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "uploads"
  });
});

function convertFilename(filename){
  return new Promise((resolve, reject) => {
    crypto.randomBytes(16, (err, buf) => {
      if (err) {
        return reject(err);
      }
      filename = buf.toString('hex') + path.extname(filename);
      resolve(filename);
    });
  });
}

function convertVideo(filename, extension_new) {
  var Converter = new ffmpeg({ nolog: true })
  var ffmpegWriter = Converter
    .input(filename)
    .size('?x240')
    .videoBitrate('512k')
    .toFormat(extension_new)
    // setup event handlers
    .on('end', function() {
      console.log('CONVERTED TO ' + extension_new);
    })
    .on('error', function(err) {
      console.log('an error happened: ' + err.message);
    });

  if(extension_new == 'mp4')
  {
    ffmpegWriter.outputOptions(['-movflags frag_keyframe+empty_moov']);
  }
  return ffmpegWriter;
}

function bufferToGridFS(filename, dataBuffer, extension_new) {
  return new Promise((resolve, reject)=>{
    var tx = new Transform;

    var readstream;
    if( !extension_new ) {
      readstream = new Readable()
      readstream._read = () => {} // _read is required but you can noop it
      readstream.push(dataBuffer)
      readstream.push(null)
    } else {
      readstream = convertVideo(filename, extension_new);
      filename = path.basename(filename, path.extname(filename)) + "." + extension_new;
    }

    var writestream = gfs.openUploadStream(filename)
      .on('error', function(err){ 
        reject(error);
      });

    pipeline(
      readstream,
      tx, 
      writestream,
      (err) => {
        if (err) {
          reject(err)
        } else {
          resolve();
        }
      }
    );
  });
}

router.post('/posts', upload.array('media'), async (req,res, next)=>{
  console.log(req.files);
  console.log(req.body.text);
  var promises = []
  var filenames = [];
  for(let i = 0, l = req.files.length; i < l; i++)
  {
    req.files[i].filename = await convertFilename(req.files[i].originalname);
    console.log(req.files[i].originalname);
    if(req.files[i].mimetype == "video/mp4" || req.files[i].mimetype == "video/webm" || req.files[i].mimetype == "video/ogg")
    {
      fs.writeFileSync(req.files[i].filename, req.files[i].buffer)
      promises.push(bufferToGridFS(req.files[i].filename,req.files[i].buffer,"mp4"));
      promises.push(bufferToGridFS(req.files[i].filename,req.files[i].buffer,"webm"));
      promises.push(bufferToGridFS(req.files[i].filename,req.files[i].buffer,"ogv"));
    } else {
      promises.push(bufferToGridFS(req.files[i].filename,req.files[i].buffer));
    }
    filenames.push(req.files[i].filename);
  }
  Promise.all(promises)
    .then(() => {
      for(let i = 0, l = filenames.length; i < l; i++ ) {
        if (fs.existsSync(filenames[i])) {
          fs.unlinkSync(filenames[i]);
        } 
      }
      posts.create({text: req.body.text, media: filenames}).then(function(data){
          res.status(200).json({
          message:'Success',
          obj: data
        })
      }).catch(next);
      console.log('created!');
    })
  .catch((err) => {
    console.log(err);
  });
});


router.get('/media/:filename', (req,res)=>{
  const file = gfs
  .find({
    filename: req.params.filename
  })
  .toArray((err, files) => {
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: "no files exist"
      });
    }
    gfs.openDownloadStreamByName(req.params.filename).pipe(res);
  });
});

router.get('/posts',function(req,res,next){
  console.log('here!');
  posts.find().exec(function(err,inputs){
    if(err){
      return res.status(500).json({
        title:'Error',
        error:err
      });
    }
    console.log('no error');
    console.log(inputs);
    res.status(200).json({
      message:'Success',
      obj: inputs
    })
  })
});

router.delete('/posts/:id',function(req,res,next){
  posts.findByIdAndRemove({_id:req.params.id}).then(function(data){
    gfs.remove({_id:data.profileImage , root: 'uploads'},function(err){
      if (err) {
        return handleError(err);
      }
      res.status(200).json({
        message:'Success'
      })
    });
  }).catch(next);
});

module.exports = router;