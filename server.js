var express = require("express");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);

// var nodeEnv = process.env.NODE_ENV || "development";

// let mongoURL; 
// mongoURL = process.env.MONGODB_URI; 
// mongoose.connect(mongoURL);

app.get("/scrape", function(req, res) {

  var articlesArray = ["true-crime/?", "arts-and-entertainment/?"];

  var randomNumber = Math.floor(Math.random() * 2);
    // First, we grab the body of the html with axios
    axios.get("https://www.washingtonpost.com/news/" + articlesArray[randomNumber]).then(function(response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);
     // console.log(response.data);
     var result = [];
      // Now, we grab every h2 within an article tag, and do the following:
      $("div.story-list-story").each(function(i, element) {
   
        var title = $(element).find("h3").find("a").text();
        // // Add the text and href of every link, and save them as properties of the result object
        var link = $(element).find("h3").find("a").attr("href");

        var description = $(element).find(".story-description").find("p").text();

        var img = $(element).find(".story-image").find("a").find("img").attr("src");

        result.push({
            title: title,
            link: link,
            description : description,
            img : img
          });
       
        // // Create a new Article using the `result` object built from scraping
        db.Article.create(result)
          .then(function(dbArticle) {
            // View the added result in the console
            console.log(dbArticle);
          })
          .catch(function(err) {
            // If an error occurred, log it
            console.log(err);
          });
      });
  
      // Send a message to the client
      console.log(result);
     res.render("index");
    });
  });

  // Route for getting all Articles from the db
app.get("/articles", function(req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
    .populate("notes")
      .then(function(dbArticle) {
        // If we were able to successfully find Articles, send them back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  app.get("/clear", function(req, res) {
    // Grab every document in the Articles collection
    db.Article.remove({}, function(err) { 
        console.log('Article removed') ;
     });

     db.Note.remove({}, function(err) { 
        console.log('Note removed') ;
     });
    res.render("index");

  });


app.get("/", function(req, res) {
    res.render("index");
  });


app.get("/articles/:id", function(req, res) {

    console.log(req.params.id);
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.findOne({ _id: req.params.id })
      // ..and populate all of the notes associated with it
      .populate("notes")
      .then(function(dbArticle) {
        // If we were able to successfully find an Article with the given id, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  // Route for saving/updating an Article's associated Note
app.post("/submit/:id", function(req, res) {
    // Create a new note and pass the req.body to the entry
    db.Note.create(req.body)
      .then(function(dbNote) {

        return db.Article.findOneAndUpdate({_id: req.params.id},{$push: { notes: dbNote._id }}, { new: true });
      })
      .then(function(dbArticle) {
        // If we were able to successfully update an Article, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  // Delete One from the DB
app.get("/delete/:id", function(req, res) {
  // Remove a note using the objectID
  console.log(req.params.id);
  db.Note.findOneAndDelete(
    
    {_id :  req.params.id }
    ,
    function(error, removed) {
      // Log any errors from mongojs
      if (error) {
        console.log(error);
        res.send(error);
      }
      else {
        // Otherwise, send the mongojs response to the browser
        // This will fire off the success function of the ajax request
        console.log(removed);
        res.send(removed);
      }
    }
  );
});

// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });