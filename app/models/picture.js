var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var PictureSchema = new Schema({
    kind: { 
        type: String, 
        enum: ['thumbnail', 'full'],
        required: true
    },
    src: { type: String, required: true },
    title: String,
    caption: String,
    date: { type: Date, default: Date.now },
    comments: [CommentSchema]
});

var CommentSchema = new Schema({
    name: {type: String, default: "anonymous"},
    body: String,
    date: { type: Date, default: Date.now, required: true }
});

mongoose.model('Picture', PictureSchema);
mongoose.model('Comment', CommentSchema);
