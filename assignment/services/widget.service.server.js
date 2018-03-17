module.exports = function (app) {
  app.post("/api/page/:pageId/widget", createWidget);
  app.get("/api/page/:pageId/widget", findAllWidgetsForPage);
  app.get("/api/widget/:widgetId", findWidgetById);
  app.put("/api/widget/:widgetId", updateWidget);
  app.delete("/api/widget/:widgetId", deleteWidget);

  var widgets = [
    { "_id": "123", "widgetType": "HEADING", "pageId": "321", "size": 2, "text": "GIZMODO" },
    { "_id": "234", "widgetType": "HEADING", "pageId": "321", "size": 4, "text": "Lorem ipsum" },
    { "_id": "345", "widgetType": "IMAGE", "pageId": "321", "url": 'http://lorempixel.com/400/200/', "width": "100%" },
    { "_id": "456", "widgetType": "HTML", "pageId": "321", "text": "Lorem ipsum" },
    { "_id": "567", "widgetType": "HEADING", "pageId": "321", "size": 4, "text": "Lorem ipsum" },
    { "_id": "678", "widgetType": "YOUTUBE", "pageId": "321", "url": "https://www.youtube.com/embed/aFuA50H9uek", "width": "100%" },
    { "_id": "789", "widgetType": "HTML", "pageId": "321", "text": "Lorem ipsum"}
  ];

  var multer = require('multer'); // npm install multer --save
  var upload = multer({ dest: __dirname+'/../../src/assets/uploads' });
  app.post ("/api/upload", upload.single('myFile'), uploadImage);

  function uploadImage(req, res) {
    console.log("uploading");
    var userId        = req.body.userId;
    var websiteId     = req.body.websiteId;
    var pageId        = req.body.pageId;
    var widgetId      = req.body.widgetId;
    var myFile        = req.file;

    console.log('userId: ' + userId);
    console.log('widgetId: ' + widgetId);
    console.log('websiteId: ' + websiteId);
    console.log('pageId: ' + pageId);

    if (myFile === null) {
      console.log('file not exist');
      res.redirect('http://localhost:4200/profile/'+userId+'/website/'+websiteId+'/page/'+pageId+'/widget/'+widgetId);
      return;
    }

    var originalname  = myFile.originalname; // file name on user's computer
    var filename      = myFile.filename;     // new file name in upload folder
    var path          = myFile.path;         // full path of uploaded file
    var destination   = myFile.destination;  // folder where file is saved to
    var size          = myFile.size;
    var mimetype      = myFile.mimetype;

    console.log('filename: ' + filename);
    console.log('mimetype: ' + mimetype);
    console.log('path: ' + path);
    console.log('destination: ' + destination);

    for (const i in widgets) {
      if (widgets[i]._id === widgetId) {
        widgets[i].url = '/assets/uploads/'+filename;
        // res.json(widgets[i]);
        break;
      }
    }

    var callbackUrl   = "http://localhost:4200/profile/"+userId+"/website/"+websiteId+"/page/"+pageId+"/widget/";
    res.redirect(callbackUrl);
  }

  function createWidget(req, res) {
    var widgetId = '' + Math.round(Math.random() * 1000);
    var widget = req.body;
    widget._id = widgetId;

    widgets.push(widget);
    res.json(widget);
  }

  function findAllWidgetsForPage(req, res) {
    var pageId = req.params["pageId"];
    var widgetsByPage = widgets.filter(function (widget) {
      return widget.pageId === pageId;
    });
    res.json(widgetsByPage);
  }

  function findWidgetById(req, res) {
    var widgetId = req.params["widgetId"];
    var widget = widgets.find(function (widget) {
      return widget._id === widgetId;
    });
    res.json(widget);
  }

  function updateWidget(req, res) {
    var widgetId = req.params["widgetId"];
    var widget = req.body;

    for (var i = 0; i < widgets.length; i++) {
      if (widgets[i]._id === widgetId) {
        widgets[i].pageId = widget.pageId;
        widgets[i].widgetType = widget.widgetType;
        widgets[i].url = widget.url;
        widgets[i].text = widget.text;
        widgets[i].size = widget.size;
        widgets[i].width = widget.width;

        res.json(widgets[i]);
        return;
      }
    }
    res.status(400).send("not found!");
  }

  function deleteWidget(req, res) {
    var widgetId = req.params["widgetId"];

    for (var i = 0; i < widgets.length; i++) {
      if (widgets[i]._id === widgetId) {
        const j = +i;
        widgets.splice(j, 1);
      }
    }
    res.json({});
  }
};
