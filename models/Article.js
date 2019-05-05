var mongoose = require("mongoose");

//reference to a schema constructor
var Schema = mongoose.Schema;

// Schema Object
var ArticleSchema = new Schema({

  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  category: {
    type: String
  },
  note: {
    type: Schema.Types.ObjectId,
    ref: "Comment"
  }
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;
