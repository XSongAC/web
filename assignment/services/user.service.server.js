module.exports = function (app) {
  app.post("/api/user", createUser());
  app.put("/api/user/:userId", updateUser);
  app.get("/api/user?username=username", findUserByUsername);
  app.get("/api/user?username=username&password=password", findUserByCredentials);
  app.get("/api/user/:userId", findUserById);
  app.delete("/api/user/:userId", deleteUser);

  var users = [
    {_id: "123", username: "alice", password: "alice", email: '', firstName: "Alice", lastName: "Wonderland"},
    {_id: "234", username: "bob", password: "bob", email: '', firstName: "Bob", lastName: "Marley"},
    {_id: "345", username: "charly", password: "charly", email: '', firstName: "Charly", lastName: "Garcia"},
    {_id: "456", username: "jannunzi", password: "jannunzi", email: '', firstName: "Jose", lastName: "Annunzi"}
  ];

  function createUser(req, res) {
    var userId = '' + Math.round(Math.random() * 1000);

    var new_user = {
      _id: userId,
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName
    };

    users.push(new_user);
    res.json(new_user);
  }

  function updateUser(req, res) {
    var userId = req.params['userId'];
    var user = req.body;
    for (var i = 0; i < users.length; i++) {
      if (users[i]._id === userId) {
        users[i].username = user.username;
        users[i].firstName = user.firstName;
        users[i].lastName = user.lastName;
        users[i].password = user.password;
        users[i].email = user.email;

        res.json(users[i]);
        return;
      }
    }
    res.status(404).send("not found!");
  }

  function findUserByUsername(req, res) {
    var username = req.query['username'];

    console.log(req.body);

    var user = users.find(function (user) {
      return user.username === username;
    });
    res.json(user);
  }

  function findUserByCredentials(req, res) {
    var username = req.query['username'];
    var password = req.query['password'];

    var user = null;

    if (username && password) {
      user = users.find(function (user) {
        return user.username === username && user.password === password;
      });
    }
    res.json(user);
  }

  function findUserById(req, res) {
    var userId = req.params['userId'];

    console.log(req.body);

    var user = users.find(function (user) {
      return user._id === userId;
    });
    res.json(user);
  }

  function deleteUser(req, res) {
    var userId = req.params['userId'];

    for (var i = 0; i < users.length; i++) {
      if (users[i]._id === userId) {
        const j = +i;
        users.splice(j, 1);
      }
    }
    res.json({});
  }
};
