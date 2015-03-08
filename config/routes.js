var pictures = require("../app/controllers/pictures");

module.exports = function(app){
  app.get('/api/pictures', pictures.pictures_list);
  app.get('/api/pictures/:id', pictures.view);
  app.post('/api/pictures', pictures.create);
  app.put('/api/pictures', pictures.update_batch);
  app.put('/api/pictures/:id', pictures.update);
  app.delete('/api/pictures', pictures.delete_batch);
  app.delete('/api/pictures/:id', pictures.delete);
}
