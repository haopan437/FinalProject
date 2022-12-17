var express = require("express");
var router = express.Router();
var model = require("../model");
var moment = require("moment");

//home page
router.get("/", function (req, res, next) {
  var username = req.session.username || "";
  var page = req.query.page || 1;
  var data = {
    total: 0, 
    curPage: page,
    list: [], 
  };
  var pageSize = 10;
  model.connect(function (db) {
    db.collection("articles")
      .find()
      .toArray(function (err, docs) {
        data.total = Math.ceil(docs.length / pageSize);
        model.connect(function (db) {
          db.collection("articles")
            .find()
            .sort({ _id: -1 })
            .limit(pageSize)
            .skip((page - 1) * pageSize)
            .toArray(function (err, docs2) {
              if (docs2.length == 0) {
                res.redirect("/?page=" + (page - 1 || 1));
              } else {
                docs2.map(function (ele, index) {
                  ele["time"] = moment(ele.id).format("YYYY-MM-DD HH:mm:ss");
                });
                data.list = docs2;
              }
              res.render("index", { username: username, data: data });
            });
        });
      });
  });
});

router.get("/regist", function (req, res, next) {
  res.render("regist", {});
});

router.get("/login", function (req, res, next) {
  res.render("login", {});
});

router.get("/write", function (req, res, next) {
  var username = req.session.username || "";
  var id = parseInt(req.query.id);
  var page = req.query.page;
  var item = {
    title: "",
    content: "",
  };
  if (id) {
    model.connect(function (db) {
      db.collection("articles").findOne({ id: id }, function (err, docs) {
        if (err) {
          console.log("Query failed.");
        } else {
          item = docs;
          item["page"] = page;
          res.render("write", { username: username, item: item });
        }
      });
    });
  } else {
    res.render("write", { username: username, item: item });
  }
});

router.get("/detail", function (req, res, next) {
  var id = parseInt(req.query.id);
  var username = req.session.username || "";
  model.connect(function (db) {
    db.collection("articles").findOne({ id: id }, function (err, docs) {
      if (err) {
        console.log("Query failed.", err);
      } else {
        var item = docs;
        item["time"] = moment(item.id).format("YYYY-MM-DD HH:mm:ss");
        res.render("detail", { item: item, username: username });
      }
    });
  });
});

// 渲染详情页
router.get('/userarticles', function(req, res,next) {
  var username = req.session.username || ''
  var data = {
    list: [] ,  // 当前页的文章列表
    username:"",
    email:"",
    role:"",
  }

  model.connect(function(db) {
    db.collection('users').find({username: username}).toArray(function(err, docs2) {
      if (err) {
        console.log('查询失败', err)
      } else {
        console.log('users', docs2)
        data.username = docs2[0]['username']
        data.email = docs2[0]['email']
        data.role = docs2[0]['role']
        console.log('data', data)
      }
    })
  })
  if(data.username!==null){
    model.connect(function(db) {

      db.collection('articles').find({username:username}).toArray(function(err, docs) {
        if (err) {
          res.redirect('/')
        }else {
          if (docs.length === 0) {
            res.redirect('/')
          } else {
            docs.map(function(ele, index) {
              ele['time'] = moment(ele.id).format('YYYY-MM-DD HH:mm:ss')
            })
            console.log('data1',docs )
            data.list = docs
            console.log('data1', data)
            res.render("userpage",  {data:data} );
          }
        }
      })
    })
  }

})

module.exports = router;
