var mongoose = require("mongoose"),
    express = require("express");

var Picture = mongoose.model("Picture");

var app = express();

// POST to CREATE
exports.create = function (req, res) {
  var picture;
  console.log("POST: ");
  console.log(req);
  picture = new Picture({
    kind: req.body.kind || "full",
          src: req.files.file.name,
          title: req.body.title,
          caption: req.body.caption
  });
  picture.save(function(err, picture) {
    if (!err) {
      res.status(201);
      res.json({
        type: true,
        data: picture
      });
    } else {
      console.log("this is an error");
      res.status(500);
      res.json({
        type: false,
        data: "Error occured: " + err
      });
    }
  });
  //return res.send(picture);
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
    Picture.update({ "_id": req.params.id }, req.body, function (err, numAffected) {
      if (!err) {
        console.log("updated");
        res.status(204);
        res.json({
          data: picture
        });
      } else {
        console.log("this is an error in the update method");
        console.log(err);
        res.status(500);
        res.json({
          data: "Error occured: " + err
        });
      }
    });
  });
}

// GET to READ

// List picture
exports.pictures_list = function (req, res) {
  return Picture.find(function (err, pictures) {
    if (!err) {
      res.status(200);
      res.json({
        data: pictures
      });
    } else {
      console.log("this is an error");
      res.status(500);
      res.json({
        data: "Error occured: " + err
      });
    }
  });
}

// Single picture
exports.view = function (req, res) {
  return Picture.findById(req.params.id, function (err, picture) {
    if (!err) {
      res.status(200);
      res.json({
        data: picture
      });
    } else {
      console.log("this is an error");
      res.status(500);
      res.json({
        data: "Error occured: " + err
      });
    }
  });
}

// DELETE to DESTROY

// Bulk destroy all pictures
exports.delete_batch = function (req, res) {
  Picture.remove(function (err) {
    if (!err) {
      res.status(204);
      res.json({
        data: ''
      });
    } else {
      console.log("this is an error");
      res.status(500);
      res.json({
        data: "Error occured: " + err
      });
    }
  });
}

// remove a single picture
exports.delete = function(req, res) {
  return Picture.findById(req.params.id, function(err, picture) {
    return picture.remove(function (err) {
      if (!err) {
        res.status(204);
        res.json({
          data: ''
        });
      } else {
        console.log("this is an error");
        res.status(500);
        res.json({
          data: "Error occured: " + err
        });
      }
    });
  });
}
