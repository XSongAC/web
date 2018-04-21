var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var bcrypt = require("bcrypt-nodejs");

// get clientID from facebook developers site, setting up Facebook login first with callbackURL
var facebookConfig = {
  clientID     : '213029699464115',
  clientSecret : 'fced8daecb2a4ffb57b3371560d5296b',
  callbackURL  : 'https://newweb2018.herokuapp.com/auth/facebook/callback'
};




module.exports = function (app) {

  var UserModel = require("../models/user/user.model.server.js");

  app.post("/api/user", createUser);
  app.get("/api/user", findUserByCredentials);
  app.get("/api/user/:userId", findUserById);
  app.put("/api/user/:userId", updateUser);
  app.delete("/api/user/:userId", deleteUser);

  app.get ('/facebook/login', passport.authenticate('facebook', { scope : 'email' }));
  app.post('/api/login', passport.authenticate('local'), login);
  app.post('/api/logout', logout);
  app.post('/api/register', register);
  app.post ('/api/loggedIn', loggedIn);
  app.get('/auth/facebook/callback',
      passport.authenticate('facebook', {
          successRedirect: '/profile',
          failureRedirect: '/register'
  }));


  passport.use(new LocalStrategy(function(username, password, done) {
    UserModel
      .findUserByUserName(username)
      .then(
        function(user) {
          if(user && bcrypt.compareSync(password, user.password)) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        },
        function(err) {
          if (err) { return done(err); }
        }
      );
  }));

  passport.serializeUser(serializeUser);
  passport.deserializeUser(deserializeUser);
  passport.use(new FacebookStrategy(facebookConfig, facebookStrategy));

  function serializeUser(user, done) {
        done(null, user);
  }

  function deserializeUser(user, done) {
      UserModel
        .findUserById(user._id)
        .then(
            function(user){
              done(null, user);
            },
            function(err){
              done(err, null);
            }
        );
  }


  function facebookStrategy(token, refreshToken, profile, done) {
      UserModel.findFacebookUser(profile.id).then(
          function (user) {
              if (user) {
                  return done(null, user);
              } else {
                  var names = profile.displayName.split(" ");
                  var newFacebookUser = {
                      username: 'temp username',
                      password: bcrypt.hashSync("temp password"),
                      lastName: names[1],
                      firstName: names[0],
                      email: profile.emails ? profile.emails[0].value : "",
                      facebook: {
                        id: profile.id,
                        token: token
                      }
                  };
                  return UserModel.createUser(newFacebookUser);
                }
          },
          function (err) {
             if (err) {
                return done(err);
             }
          }
        ).then(
          function (user) {
              return done(null, user);
          },
          function (err) {
              if (err) {
                  return done(err);
              }
            }
        );
  }

  function login(req, res) {
      var user = req.user;
      res.json(user);
    }

  function logout(req, res) {
      req.logout();
      res.json(200);
      // res.redirect('/login');
  }

  function loggedIn(req, res) {
      res.send(req.isAuthenticated() ? req.user : '0');
  }

  function register(req, res) {
      var newUser = req.body;
      newUser.password = bcrypt.hashSync(newUser.password);
      UserModel.findUserByUserName(newUser.username).then(
          function (user) {
              if (user) {
                  res.sendStatus(400).json("Username is in use!");
                  return;
              } else {
                  UserModel.createUser(newUser).then(
                      function (user) {
                          if (user) {
                            req.login(user, function (err) {
                                  if (err) {
                                      res.sendStatus(400).send(err);
                                  } else {
                                      res.json(user);
                                  }
                            });
                          }
                      }
                  )
              }
          }
      )
  }


  function createUser(req, res){
    var user = req.body;
    UserModel.createUser(user).then((user) => {
      console.log(user);
      res.json(user);
    });
  }


  function findUserByCredentials(req, res){
    var username = req.query.username;
    var password = req.query.password;
    var user = null;

    if (username && password){
      UserModel.findUserByCredentials(username, password).then( function (user) {
          console.log(user);
          if (user) {
            res.status(200).send(user);
          } else {
            res.status(404).send('Not found');
          }
        }
      )
    }
  }


  function findUserById(req, res){
    var userId = req.params["userId"];
    UserModel.findUserById(userId).then((user) => res.json(user));
  }

  function findAllUsers(req, res){
    res.json(users);
  }

  function findUsers(req, res){
    var username = req.query["username"];
    var password = req.query["password"];

    var user = null;

    if (username && password){
      user = users.find(function (user) {
        return user.username === username && user.password === password;
      });
    }
    res.json(user);
  }

  function updateUser(req, res){
    var userId = req.params['userId'];
    var user = req.body;
    user.password = bcrypt.hashSync(user.password);

    UserModel.updateUser(userId, user).then(function(user) {
      if (user) {
        res.status(200).send(user);
      } else {
        res.status(404).send("not found!");
      }
    });
  }

  function deleteUser(req, res){
    var userId = req.params['userId'];

    UserModel.deleteUser(userId).then(() => (
      res.sendStatus(200)
    ));
  }


  function findUserByUsername(req, res) {
    var username = req.query["username"];
    UserModel.findUserByUserName(username).then(
      function (user) {
        if (user) {
          res.json(user);
        } else {
          res.sendStatus(400).send("Cannot find user with the username");
        }
      },
      function (err) {
        res.sendStatus(400).send(err);
      }
    );
  }
};
