var mongoose = require("mongoose"),
    express = require("express");

var Picture = mongoose.model("Picture");

var app = express();

// POST to CREATE
exports.create = function (req, res) {
  var picture;
  console.log("POST: ");
  console.log(req.files);
  picture = new Picture({
    kind: req.body.kind || "full",
    src: req.files.file.name,
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
}

// PUT to UPDATE
// Bulk update
exports.update_batch = function (req, res) {
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
        Picture.update({ "_id": id }, req.body.picture[i][id], function (err, numAffected) {
            if (err) {
                console.log("Error on update");
                console.log(err);
            } else {
                console.log("updated num: " + numAffected);
            }
        });
    }
    return res.send(req.body.picture);
}

// Single update
exports.update = function (req, res) {
  return Picture.findById(req.params.id, function (err, picture) {
    picture.kind = req.body.kind;
    picture.url = req.body.url;
    picture.title = req.body.title;
    picture.caption = req.body.caption;
    return picture.save(function (err) {
      if (!err) {
        console.log("updated");
      } else {
        console.log(err);
        return res.send(err);
      }
      return res.send(picture);
    });
  });
}

// GET to READ

// List picture
exports.pictures_list = function (req, res) {
  return Picture.find(function (err, pictures) {
    if (!err) {
      return res.send(pictures);
    } else {
      return console.log(err);
    }
  });
}

// Single picture
exports.view = function (req, res) {
  return Picture.findById(req.params.id, function (err, picture) {
    if (!err) {
      return res.send(picture);
    } else {
      return console.log(err);
    }
  });
}

// DELETE to DESTROY

// Bulk destroy all pictures
exports.delete_batch = function (req, res) {
  Picture.remove(function (err) {
    if (!err) {
      console.log("removed");
      return res.send('');
    } else {
      console.log(err);
    }
  });
}

// remove a single picture
exports.delete = function (req, res) {
  return Picture.findById(req.params.id, function (err, picture) {
    return picture.remove(function (err) {
      if (!err) {
        console.log("removed");
        return res.send('');
      } else {
        console.log(err);
      }
    });
  });
}
