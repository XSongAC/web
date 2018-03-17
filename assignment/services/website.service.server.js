module.exports = function (app) {
  app.post("/api/user/:userId/website", createWebsite);
  app.get("/api/user/:userId/website", findAllWebsitesForUser);
  app.get("/api/website/:websiteId", findWebsiteById);
  app.put("/api/website/:websiteId", updateWebsite);
  app.delete("/api/website/:websiteId", deleteWebsite);

  var websites = [
    { "_id": "123", "name": "Facebook", "developerId": "456", "description": "Lorem" },
    { "_id": "234", "name": "Tweeter", "developerId": "456", "description": "Lorem" },
    { "_id": "456", "name": "Gizmodo", "developerId": "456", "description": "Lorem" },
    { "_id": "890", "name": "Go", "developerId": "123", "description": "Lorem" },
    { "-id": "567", "name": "Tic Tac Toe", "developerId": "123", "description": "Lorem" },
    { "_id": "678", "name": "Checkers", "developerId": "123", "description": "Lorem" },
    { "_id": "789", "name": "Chess", "developerId": "234", "description": "Lorem" }
  ];

  function createWebsite(req, res) {
    var userId = req.params['userId'];
    var websiteId = '' + Math.round(Math.random() * 1000);

    var new_website = {
      _id: websiteId,
      name: req.body.name,
      developerId: userId,
      description: req.body.description
    };
    websites.push(new_website);
    res.json(new_website);
  }

  function findAllWebsitesForUser(req, res) {
    var userId = req.params['userId'];
    var websitesByUser = websites.filter(function (website) {
      return website.developerId === userId;
    });
    res.json(websitesByUser);
  }

  function findWebsiteById(req, res) {
    var websiteId = req.params['websiteId'];
    var website = websites.find(function (website) {
      return website._id === websiteId;
    });
    res.json(website);
  }

  function updateWebsite(req, res) {
    var websiteId = req.params['websiteId'];
    var website = req.body;

    for (var i = 0; i < websites.length; i++) {
      if (websites[i]._id === websiteId) {
        websites[i].name = website.name;
        websites[i].developerId = website.developerId;
        websites[i].description = website.description;

        res.json(websites[i]);
        return;
      }
    }
    res.status(404).send("not found!");
  }

  function deleteWebsite(req, res) {
    var websiteId = req.params['websiteId'];

    for (var i = 0; i < websites.length; i++) {
      if (websites[i]._id === websiteId) {
        const j = +i;
        websites.splice(j, 1);
      }
    }
    res.json({});
  }
};
