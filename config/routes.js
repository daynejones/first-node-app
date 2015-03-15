var pictures = require("../app/controllers/pictures");
var path = require("path");

module.exports = function(app){
  app.get('/api/pictures', pictures.pictures_list);
  app.get('/api/pictures/:id', pictures.view);
  app.post('/api/pictures', pictures.create);
  app.put('/api/pictures', pictures.update_batch);
  app.put('/api/pictures/:id', pictures.update);
  app.delete('/api/pictures', pictures.delete_batch);
  app.delete('/api/pictures/:id', pictures.delete);
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, '../public', 'index.html')); // load the single view file (angular will handle the page changes on the front-end)
  });
}
