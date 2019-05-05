var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var CommentSchema = new Schema ({

  name: String,
  title: String,
  body: String,
  date: {
    type: Date,
    default: Date.now
  },
  hidden: Boolean,
  unique: true
});

var Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;
