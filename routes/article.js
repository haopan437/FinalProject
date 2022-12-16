var express = require("express");
var router = express.Router();
var model = require("../model");
var multiparty = require("multiparty");
var fs = require("fs");

router.post("/add", function (req, res, next) {
  var id = parseInt(req.body.id);
  if (id) {
    //update the content
    var page = req.body.page;
    var title = req.body.title;
    var content = req.body.content;
    model.connect(function (db) {
      db.collection("articles").updateOne(
        { id: id },
        {
          $set: {
            title: title,
            content: content,
          },
        },
        function (err, ret) {
          if (err) {
            console.log("Update failed.", err);
          } else {
            console.log("Update successfully.");
            res.redirect("/?page=" + page);
          }
        }
      );
    });
  } else {
    //add the new content
    var data = {
      title: req.body.title,
      content: req.body.content,
      username: req.session.username,
      id: Date.now(),
    };
    model.connect(function (db) {
      db.collection("articles").insertOne(data, function (err, ret) {
        if (err) {
          console.log("Update failed.", err);
          res.redirect("/write");
        } else {
          res.redirect("/");
        }
      });
    });
  }
});

//delete the content
router.get("/delete", function (req, res, next) {
  var id = parseInt(req.query.id);
  var page = req.query.page;
  model.connect(function (db) {
    db.collection("articles").deleteOne({ id: id }, function (err, ret) {
      if (err) {
        console.log("Delete failed.");
      } else {
        console.log("Delete successfully.");
      }
      res.redirect("/?page=" + page);
    });
  });
});

router.post("/upload", function (req, res, next) {
  var form = new multiparty.Form();
  form.parse(req, function (err, fields, files) {
    if (err) {
      console.log("Upload failed.", err);
    } else {
      console.log("All tweets", files);
      var file = files.filedata[0];
      var rs = fs.createReadStream(file.path);
      var newPath = "/uploads/" + file.originalFilename;
      var ws = fs.createWriteStream("./public" + newPath);
      rs.pipe(ws);
      ws.on("close", function () {
        console.log("upload successfully.");
        res.send({ err: "", msg: newPath });
      });
    }
  });
});

module.exports = router;
