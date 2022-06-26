const express = require("express");
const bdparse = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true });
const articlSchema = {
  title: String,
  content: String,
};
const Article = mongoose.model("Articles", articlSchema);

app
  .route("/articles")
  .get(function (req, res) {
    Article.find(function (err, founditem) {
      if (!err) {
        res.send(founditem);
      } else {
        res.send(err);
      }
    });
  })

  .post(function (req, res) {
    console.log(req.body.title);
    console.log(req.body.content);

    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    newArticle.save(function (err) {
      if (!err) {
        res.send("Successfully added a new artilce.");
      } else {
        res.send(err);
      }
    });
  })

  .delete(function (req, res) {
    Article.deleteMany(function (err) {
      if (!err) {
        res.send("Successfully deleted all articles");
      } else {
        res.send(err);
      }
    });
  });

app
  .route("/articles/:articleTitle")
  .get(function (req, res) {
    Article.findOne(
      { title: req.params.articleTitle },
      function (err, founditem) {
        if (founditem) {
          res.send(founditem);
        } else {
          res.send("No artilce matching that title was found.");
        }
      }
    );
  })
  .put(function (req, res) {
    Article.updateOne(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      function (err) {
        if (!err) {
          res.send("Successfully updated");
        } else {
          console.log(err);
          res.send(err);
        }
      }
    );
  })
  .patch(function (req, res) {
    Article.updateOne(
      { title: req.params.articleTitle },
      { $set: req.body },
      function (err) {
        if (!err) {
          res.send("Successfully updated");
        } else {
          console.log(err);
          res.send(err);
        }
      }
    );
  })
  .delete(function (req, res) {
    Article.deleteOne({ title: req.params.articleTitle }, function (err) {
      if (!err) {
        res.send("Successfully deleted articletitle");
        console.log("Successfully");
      } else {
        res.send(err);
        console.log(err);
      }
    });
  });
// app.get("/articles", function (req, res) {
//   Article.find(function (err, founditem) {
//     if (!err) {
//       res.send(founditem);
//     } else {
//       res.send(err);
//     }
//   });
// });

// app.post("/articles", function (req, res) {
//   console.log(req.body.title);
//   console.log(req.body.content);

//   const newArticle = new Article({
//     title: req.body.title,
//     content: req.body.content,
//   });
//   newArticle.save(function (err) {
//     if (!err) {
//       res.send("Successfully added a new artilce.");
//     } else {
//       res.send(err);
//     }
//   });
// });

// app.delete("/articles", function (req, res) {
//   Article.deleteMany(function (err) {
//     if (!err) {
//       res.send("Successfully deleted all articles");
//     } else {
//       res.send(err);
//     }
//   });
// });
app.listen(3000, function () {
  console.log("Server is running on Port:3000");
});
