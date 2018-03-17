module.exports = function (app) {
  app.post("/api/website/:websiteId/page", createPage);
  app.get("/api/website/:websiteId/page", findAllPagesForWebsite);
  app.get("/api/page/:pageId", findPageById);
  app.put("/api/page/:pageId", updatePage);
  app.delete("/api/page/:pageId", deletePage);

  var pages = [
    { "_id": "321", "name": "Post 1", "websiteId": "456", "title": "Lorem" },
    { "_id": "432", "name": "Post 2", "websiteId": "456", "title": "Lorem" },
    { "_id": "543", "name": "Post 3", "websiteId": "456", "title": "Lorem" },
    { "_id": "654", "name": "Post 1", "websiteId": "789", "title": "Lorem" },
    { "_id": "765", "name": "Post 2", "websiteId": "789", "title": "Lorem" },
    { "_id": "876", "name": "Post 3", "websiteId": "789", "title": "Lorem" }
  ];

  function createPage(req, res) {
    var websiteId = req.params['websiteId'];
    var pageId = '' + Math.round(Math.random() * 1000);

    var new_page = {
      _id: pageId,
      name: req.body.name,
      websiteId: websiteId,
      title: req.body.title
    };

    pages.push(new_page);
    res.json(new_page);
  }

  function findAllPagesForWebsite(req, res) {
    var websiteId = req.params['websiteId'];

    var pagesByWebsite = pages.filter(function (page) {
      return page.websiteId === websiteId;
    });
    res.json(pagesByWebsite);
  }

  function findPageById(req, res) {
    var pageId = req.params['pageId'];

    var page = pages.find(function (page) {
      return page._id === pageId;
    });
    res.json(page);
  }

  function updatePage(req, res) {
    var pageId = req.params['pageId'];
    var page = req.body;

    for (var i = 0; i < pages.length; i++) {
      if (pages[i]._id === pageId) {
        pages[i].websiteId = page.websiteId;
        pages[i].name = page.name;
        pages[i].title = page.title;

        res.json(pages[i]);
        return;
      }
    }
    res.status(400).send("not found!");
  }

  function deletePage(req, res) {
    var pageId = req.params['pageId'];

    for (var i = 0; i < pages.length; i++) {
      if (pages[i] === pageId) {
        const j = +i;
        pages.splice(j, 1);
      }
    }
    res.json({});
  }
};
