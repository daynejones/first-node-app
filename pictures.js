var MongoClient = require('mongodb').MongoClient,
  Server = require('mongodb').Server,
  db;

var mongoClient = new MongoClient(new Server('localhost', 27017));
mongoClient.open(function(err, mongoClient) {
  db = mongoClient.db("pictures");
  db.collection('pictures', {strict:true}, function(err, collection) {
    if (err) {
      console.log("The 'pictures' collection doesn't exist. Creating it with sample data...");
      //populateDB();
    }
  });
});

exports.findAll = function(req, res) {
  var name = req.query["name"];
  db.collection('pictures', function(err, collection) {
    if (name) {
      collection.find({"fullName": new RegExp(name, "i")}).toArray(function(err, items) {
        res.jsonp(items);
      });
    } else {
      collection.find().toArray(function(err, items) {
        res.jsonp(items);
      });
    }
  });
};


