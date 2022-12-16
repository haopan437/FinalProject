// var MongoClient = require('mongodb').MongoClient
// //
// var url = 'mongodb://localhost:27017'
// var dbName = 'project'

// // 数据库的连接方法封装
// function connect(callback) {
//   MongoClient.connect(url, function(err, client) {
//     if (err) {
//       console.log('数据库连接错误', err)
//     } else {
//       var db = client.db(dbName)
//       callback && callback(db)
//       client.close()
//     }
//   })
// }
//
// module.exports = {
//   connect
// }

// mongosh "mongodb+srv://cluster0.n7aymk6.mongodb.net/myFirstDatabase" --apiVersion 1 --username HaoPan


var  MongoClient  = require("mongodb").MongoClient;

const password = encodeURIComponent("Kzlkzy130");

let uri =
    `mongodb+srv://HaoPan:${password}@cluster0.n7aymk6.mongodb.net/project`;

// "mongodb+srv://cluster0.n7aymk6.mongodb.net/myFirstDatabase" --apiVersion 1 --username HaoPan

// const client = new MongoClient(uri);

var dbName = 'project'
function connect(callback) {
  MongoClient.connect(uri, function(err, client) {
    if (err) {
      console.log('数据库连接错误', err)
    } else {
      var db = client.db(dbName)
      callback && callback(db)
      client.close()
    }
  })
}



// connect().catch(console.dir);
module.exports = {
  connect
}