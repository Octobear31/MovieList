var express = require('express');
var app = express();
var session = require('express-session');
var MongoClient = require('mongodb').MongoClient;
// var url = "mongodb://localhost:27017/usersDB";
var url = "mongodb://Vasyl:19941994@ds163494.mlab.com:63494/movielist_db";
var bp = require('body-parser');
var fs = require('fs');
// const imdb = require('imdb-api');
const mdb = require('moviedb')('4c35adaaf9565619373148e005200514');

app.use(express.static('public/'));
app.use(bp.urlencoded({ extended: false }));
app.use(session({ secret: 'I know your secret', cookie: { maxAge: 600000 }, login: '', email: '' }));

app.set('port', (process.env.PORT || 3002));
app.set("views", "./views");
app.set("view engine", "jade");

app.get('/', function (req, res) {
  if (!session.login) {
    res.render('mainUnLog');
  }
  else {
    var myMoviesToScreen = [];
    var moviesSeen = [];
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      db.collection("musers").find({ email: session.email }).toArray(function (err, user) {
        if (err) throw err;
        var movieIdArr = user[0].movieId;
        if (typeof user[0].seen !== undefined) {
          moviesSeen = user[0].seen;
        }
        // console.log(user[0]);
        // console.log(movieIdArr);
        // for (var i = 0; i < movieIdArr.length; i++) {
        //   db.collection("movieDB").find({ id: movieIdArr[i] }).toArray(function (err, movies) {
        //     if (err) throw err;
        //     if (movies != null) {
        //       res.json(movies.results);
        //       console.log(movies);
        //     }

        //   });

        // }
        db.collection("movieDB").find({ id: { $in: movieIdArr } }, function (err, result) {
          if (err) throw err;
          result.toArray(function (err, docs) {
            if (docs != null) {
              myMoviesToScreen = docs;
              // console.log(docs);
              /////////////////////////////////////// mark as seen

              app.post("/markSeen", function (req, res) {
                var movId = parseInt(req.body.dataid, 10);
                // var seen = '';
                // console.log(req.body);
                MongoClient.connect(url, function (err, db) {
                  if (err) throw err;
                  db.collection("musers").find({ email: session.email }).toArray(function (err, user) {
                    if (err) throw err;
                    // var movieIdArr = user[0].movieId;
                    var movInd = user[0].seen.indexOf(movId);
                    console.log(movInd);
                    if (movInd == -1) {
                      user[0].seen.push(movId);
                      db.collection("musers").updateOne({ email: session.email }, user[0], function (err, resultat) {
                        if (err) throw err;
                        res.send(true);
                      });


                    } else {
                      db.collection("musers").find({ email: session.email }).toArray(function (err, user) {
                        if (err) throw err;
                        // var movieIdArr = user[0].movieId;
                        var movInd = user[0].seen.indexOf(movId);
                        console.log(movInd);
                        user[0].seen.splice(movInd, 1);
                        db.collection("musers").updateOne({ email: session.email }, user[0], function (err, resultat) {
                          if (err) throw err;
                          res.send(false);
                        });
                  
                      });
                    };
                  });
                });
              });

              // console.log(docs);
            }
            res.render('mainLog', { login: session.login, movies: myMoviesToScreen, word: moviesSeen });

          });
        });
        ///////////////////// delete movie
        // db.collection("musers").find({ email: session.email }).toArray(function (err, user) {
        //   if (err) throw err;
        //   var delid = parseInt(req.params.id, 10);
        //   var delarr = user[0].movieId;
        //   console.log("delete" +delarr);
        //   db.collection("musers").deleteOne({delarr : delid}, function (err, obj) {
        //     if (err) throw err;
        //     console.log("1 document deleted");
        //     // db.close();
        //   });
        // });

      });
    });


  };
});

// app.get("/logedUser", function (req, res) {
//   res.sendFile(__dirname + "/public/nuser.html");
// });

app.get("/sign_in", function (req, res) {
  if (!session.login) {
    res.render('signIn');
  }
  else {
    res.redirect('/');
  }
});

app.get("/registration", function (req, res) {
  if (!session.login) {
    res.render('registration');
  }
  else {
    res.redirect('/');
  }
});


app.get("/p:id", function (req, res) {
  var id = parseInt(req.params.id, 10);

  mdb.movieInfo({ id: id }, (err, result) => {
    // console.log(result);
    res.render("details", { details: result })
  });
});
////////////////////////////////////////////////////// search log
app.post('/mdbSearchLog', function (req, res) {
  if (session.login) {
    var input = req.body.name;
    console.log(input);
    if (input == "") {
      res.send(false);
    } else {
      // console.log(input);
      mdb.searchMovie({ query: input }, (err, data) => {
        let dataM = data;
        if (dataM.total_results == 0) {
          res.send(false);
        } else {
          // console.log(dataM);
          res.json(dataM.results);
        }
      });
    }
  }
});

/////////////////////////////////// search unlog
app.post('/mdbSearch', function (req, res) {
  var input = req.body.name;
  console.log(input);
  if (input == "") {
    res.send(false);
  } else {
    // console.log(input);
    mdb.searchMovie({ query: input }, (err, data) => {
      let dataM = data;
      if (dataM.total_results == 0) {
        res.send(false);
      } else {
        // console.log(dataM);
        res.json(dataM.results);
      }
    });
  }
});



/////////////////////////////////////// registration part is here
app.post('/registration', function (req, res) {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var user =
      { login: req.body.login, email: req.body.email, password: req.body.password, movieId: [], seen: [], comments: [] };
    db.collection("musers").insertOne(user, function (err, result) {
      if (err) throw err;
      if (result != null) {

        session.login = req.body.login;
        session.email = req.body.email;
        // console.log(session.email);

        res.end("New user " + req.body.login + " has been created.");
        // res.redirect('/');
      };
    });
    // db.collection("musers").find({}).toArray(function (err, result) {

    // });
  });
});
/////////////////////////////// authorization part
app.post('/authorization', function (req, res) {
  // console.log(req.session.cookie.user)
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var check =
      { login: req.body.login, password: req.body.password };
    db.collection("musers").findOne(check, function (err, result) {
      if (err) throw err;
      // console.log(result.email);
      if (result != null) {
        session.login = req.body.login;
        session.email = result.email;
        var auth_user_name = { "auth": "true", "name": result.login }
        x = JSON.stringify(auth_user_name);
        res.end(x);
      } else {
        res.end('{"auth" : "false", "message" : "Login name or password is incorrect"}');
      };
    });
    // db.collection("musers").find({}).toArray(function (err, result) {
    //   // console.log(result); 
    // });
  });

});

//////////////////////////// sign out

app.post("/signOut", function (req, res) {
  session.login = '';
  res.send("true");
});

/////////////////////////////// add to list

app.post("/addMov", function (req, res) {
  var mId = parseInt(req.body.dataId, 10);
  // console.log(mId);
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    db.collection("musers").find({ email: session.email }).toArray(function (err, result) {
      // console.log(result);
      if (err) throw err;
      if (result != null) {
        // console.log(result[0].movieId);

        if (result[0].movieId.indexOf(mId) == -1) {
          result[0].movieId.push(mId);
          db.collection("musers").updateOne({ email: session.email }, result[0], function (err, resultat) {
            if (err) throw err;
            res.send(true);
            // console.log("1 document updated");
          });
          mdb.movieInfo({ id: mId }, (err, movieObj) => {
            // console.log(result);
            var checkMDB = { id: mId }
            db.collection("movieDB").findOne(checkMDB, function (err, result) {
              if (err) throw err;
              if (result == null) {
                movieObj.seen = 1;
                db.collection("movieDB").insertOne(movieObj, function (err, result) {
                  if (err) throw err;
                  if (result != null) {
                    console.log("Movie added to DB");
                    // res.send(true);
                  };
                });

              }
              // console.log(result);
            });

          });


        } else {
          console.log("Movie is already added to DB");
          res.send("This movie is already in your list");
        }

      };
    });


    // console.log(mId);
    // db.collection("musers").insertOne({}, function (err, result) {
    //   if (err) throw err;
    //   if (result != null) {

    //     // console.log("good job");
    //     res.end("New user " + req.body.login + " has been created");
    //   };
    // });



  });
});

///////////////////////////// delete movie

app.post("/deleteMov", function (req, res) {
  var movId = parseInt(req.body.dataid, 10);
  // console.log(req.body);
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    db.collection("musers").find({ email: session.email }).toArray(function (err, user) {
      if (err) throw err;
      // var movieIdArr = user[0].movieId;
      var movInd = user[0].movieId.indexOf(movId);
      console.log(movInd);
      user[0].movieId.splice(movInd, 1);
      db.collection("musers").updateOne({ email: session.email }, user[0], function (err, resultat) {
        if (err) throw err;
        res.send(true);
      });

    });
  });
});

// /////////////////////////////////////// mark as seen

// app.post("/markSeen", function (req, res) {
//   var movId = parseInt(req.body.dataid, 10);
//   var seen = '';
//   // console.log(req.body);
//   MongoClient.connect(url, function (err, db) {
//     if (err) throw err;
//     db.collection("musers").find({ email: session.email }).toArray(function (err, user) {
//       if (err) throw err;
//       // var movieIdArr = user[0].movieId;
//       var movInd = user[0].seen.indexOf(movId);
//       console.log(movInd);
//       if (movInd == -1) {
//         user[0].seen.push(movId);
//         db.collection("musers").updateOne({ email: session.email }, user[0], function (err, resultat) {
//           if (err) throw err;
//           res.send(true);
//         });


//       } else {
//           seen = '.blue'
//       };
//     });
//   });
// });






// app.listen(3002);
app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
});

