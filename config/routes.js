var pictures = require("../app/controllers/pictures");

module.exports = function(app){
  app.get('/api/pictures', pictures.pictures_list);
  app.post('/api/pictures', pictures.create);
  app.post('/api/pictures', pictures.update_batch);
  app.post('/api/pictures', pictures.delete_batch);
  app.post('/api/pictures/:id', pictures.delete);
  app.post('/api/pictures/:id', pictures.update);
  app.get('/api/pictures/:id', pictures.view);
}
