
// Dependencies
var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

// require the data schemas from the models folder
var db = require("./models");

var PORT = 3000;

//Initialize express
var app = express();

//---------- middleware configuration-------------//
// for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({extended: true}));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

//----Connect to the Mongo DB-----//
mongoose.connect("mongodb://localhost/news_scraper", { useNewUrlParser: true});

// ------- ROUTES --------//
app.get("/scrape", function(req,res) {
  console.log("scrape route");

  // the website I'm scraping
  axios.get("https://sciencefiction.com/").then(function(response) {

    // load the response data into cheerio
    var $ = cheerio.load(response.data);

    // grab all the "article" elements located by an h2 within in a div:
    $("div h2").each(function(i, element) {
      //variable to save result object
      var result = {};

      // save the specific/relavant info that will populate onto my site
      result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");

      // Creates a new article document in the Article collection using the `result` object built from scraping
      db.Article.create(result)
        .then(function(dbArticle) {

          console.log(dbArticle);
        })
        .catch(function(err) {
          console.log(err);
        });
    });

    res.send("Scrape Completed Successfully!");
    
  });
});

app.get("/articles", function(req, res) {
  // gets all the articles in the Article collection
  db.Article.find({})
    .then(function(dbArticle) {
      //return the articles if I succesfully scraped them. I hope so....pray
      res.json(dbArticle);
    })
    .catch(function(err) {
      //error response
      res.json(err);
    });
});

app.get("/articles/:id", function(req, res) {
  db.Article.findOne({ _id: req.params.id })
    .populate("comment")
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});

app.post("/articles/:id", function(req, res) {
  db.Comment.create(req.body)
    .then(function(dbComment) {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, {note: dbComment._id }, {new: true});
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

//--- Start the server -----//
app.listen(PORT, function() {
  console.log("App running on port " + PORT);
});