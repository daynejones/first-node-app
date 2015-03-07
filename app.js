var application_root = __dirname,
    express = require("express"),
    path = require("path"),
    mongoose = require("mongoose"),
    bodyParser = require('body-parser'),
    multer = require('multer'); 

var app = express();
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(multer()); // for parsing multipart/form-data


// database

mongoose.connect('mongodb://localhost/pictures_database');

var Schema = mongoose.Schema; //Schema.ObjectId

var Picture = new Schema({
    kind: { 
        type: String, 
        enum: ['thumbnail', 'full'],
        required: true
    },
    url: { type: String, required: true },
    title: String,
    caption: String
});

// REST api

app.get('/api', function (req, res) {
  res.send('API is running');
});

var PictureModel = mongoose.model('Picture', Picture);

// POST to CREATE
app.post('/api/pictures', function (req, res) {
  var picture;
  console.log("POST: ");
  console.log(req);
  picture = new PictureModel({
    kind: req.body.kind,
    url: req.body.url,
    title: req.body.title,
    caption: req.body.caption
  });
  picture.save(function (err) {
    if (!err) {
      return console.log("created");
    } else {
      return console.log(err);
    }
  });
  return res.send(picture);
});

// PUT to UPDATE
// Bulk update
app.put('/api/pictures', function (req, res) {
    var i, len = 0;
    console.log("is Array req.body.picture");
    console.log(Array.isArray(req.body.picture));
    console.log("PUT: (picture)");
    console.log(req.body.picture);
    if (Array.isArray(req.body.picture)) {
        len = req.body.picture.length;
    }
    for (i = 0; i < len; i++) {
        console.log("UPDATE picture by id:");
        for (var id in req.body.picture[i]) {
            console.log(id);
        }
        PictureModel.update({ "_id": id }, req.body.picture[i][id], function (err, numAffected) {
            if (err) {
                console.log("Error on update");
                console.log(err);
            } else {
                console.log("updated num: " + numAffected);
            }
        });
    }
    return res.send(req.body.picture);
});

// Single update
app.put('/api/pictures/:id', function (req, res) {
  return PictureModel.findById(req.params.id, function (err, picture) {
    picture.kind = req.body.kind;
    picture.url = req.body.url;
    picture.title = req.body.title;
    picture.caption = req.body.caption;
    return picture.save(function (err) {
      if (!err) {
        console.log("updated");
      } else {
        console.log(err);
      }
      return res.send(picture);
    });
  });
});

// GET to READ

// List picture
app.get('/api/pictures', function (req, res) {
  return PictureModel.find(function (err, pictures) {
    if (!err) {
      return res.send(pictures);
    } else {
      return console.log(err);
    }
  });
});

// Single picture
app.get('/api/pictures/:id', function (req, res) {
  return PictureModel.findById(req.params.id, function (err, picture) {
    if (!err) {
      return res.send(picture);
    } else {
      return console.log(err);
    }
  });
});

// DELETE to DESTROY

// Bulk destroy all pictures
app.delete('/api/pictures', function (req, res) {
  PictureModel.remove(function (err) {
    if (!err) {
      console.log("removed");
      return res.send('');
    } else {
      console.log(err);
    }
  });
});

// remove a single picture
app.delete('/api/pictures/:id', function (req, res) {
  return PictureModel.findById(req.params.id, function (err, picture) {
    return picture.remove(function (err) {
      if (!err) {
        console.log("removed");
        return res.send('');
      } else {
        console.log(err);
      }
    });
  });
});

// launch server

app.listen(5000);
