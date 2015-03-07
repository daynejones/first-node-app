var express = require('express'),
    lists = require('./lists'),
    pictures = require('./pictures');

var app = express();
app.use(express.static(__dirname + '/public'));

app.get('/', function(request, response) {
  response.send('Hello World!');
});

app.get('/lists', lists.findAll);
app.get('/pictures', pictures.findAll);

app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});
