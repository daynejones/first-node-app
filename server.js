var application_root = __dirname,
    express = require("express"),
    path = require("path"),
    mongoose = require("mongoose"),
    config = require('./config/config'),
    bodyParser = require('body-parser'),
    multer = require('multer'),
    favicon = require('serve-favicon');

var app = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(multer({ dest: __dirname + '/public/uploads'})); // for parsing multipart/form-data

app.use(favicon(__dirname + '/public/favicon.ico'));

if (process.env.NODE_ENV == "production"){
  //production
  mongoose.connect('mongodb://IhcAroVjevST:CFbeoTGXeZXy@mongosoup-cont002.mongosoup.de:32211/cc_IhcAroVjevST');
} else {
  //dev
  mongoose.connect('mongodb://localhost/pictures_database');
}


// routes
require('./config/routes')(app)

// launch server
app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});

module.exports = app;
