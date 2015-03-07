var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var PictureSchema = new Schema({
    kind: { 
        type: String, 
        enum: ['thumbnail', 'full'],
        required: true
    },
    url: { type: String, required: true },
    title: String,
    caption: String
});

mongoose.model('Picture', PictureSchema);
