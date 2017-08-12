const express = require("express");
const volleyball = require("volleyball");
const bodyparser = require("body-parser");
const path = require("path");
const nunjucks = require("nunjucks");
const db = require("./db").db;
const router = require('./routes');

const app = express();
app.use(volleyball);
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

// function static(directory) {
//   return function(req, res, next) {
//     const path = req.path;  //  /bootstrap.css
//     const fs = require('fs');
//     fs.readdir(directory, function(fileNames)) {
//       if (fileNames.includes(path)) {
//         res.sendFile(directory + path)
//       } else {
//         next()
//       }
//     }
//   }
// }

app.use('/bootstrap', express.static(path.join(__dirname, '/node_modules/bootstrap/dist')));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist'));

app.engine('html', nunjucks.render);
app.set('view engine', 'html');
nunjucks.configure('views', { noCache: true });

app.get('/', router);

app.use("*", function(req, res, next) {
  const err = new Error('Page not found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  const message = err.message;
  const status = err.status || 500;
  const stack = err.stack
  res.render("error.html", {message, status, stack});
});

db.sync()
  .then(() => {
    app.listen(3000, function() {
      console.log("server has started");
    });
  });

