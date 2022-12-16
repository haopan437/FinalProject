var MongoClient = require("mongodb").MongoClient;
const password = encodeURIComponent("Kzlkzy130");
let uri = `mongodb+srv://HaoPan:${password}@cluster0.n7aymk6.mongodb.net/project`;

var dbName = "project";
function connect(callback) {
  MongoClient.connect(uri, function (err, client) {
    if (err) {
      console.log("Database connection error.", err);
    } else {
      var db = client.db(dbName);
      callback && callback(db);
      client.close();
    }
  });
}

module.exports = {
  connect,
};
