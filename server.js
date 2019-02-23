var express = require("express");
var mongojs = require("mongojs");
var axios = require("axios");
var cheerio = require("cheerio");
var path = require("path");
var app = express();

var PORT = process.env.PORT ||8080;

var databaseUrl = process.env.MONGODB_URI;
var collections = ["scrapedNews"];

var db = mongojs(databaseUrl, collections);
db.on("error", function (error) {
    console.log("Database Error:", error);
});

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/saved", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/saved.html"));
});

app.use(express.static('public'))

app.get("/api/articles", function (req, res) {
    db.scrapedNews.find({ saved: false }, function (error, found) {
        if (error) {
            console.log(error);
        }
        else {
            res.json(found);
        }
    });
});

app.get("/api/saved", function (req, res) {
    db.scrapedNews.find({ saved: true }, function (error, found) {
        if (error) {
            console.log(error);
        }
        else {
            res.json(found);
        }
    });
});

app.get("/api/clear", function (req, res) {
    db.scrapedNews.remove({ saved: false }, function (error, found) {
        if (error) {
            console.log(error);
        }
        else {
            res.json(found);
        }
    });
});

app.get("/api/clearsaved", function (req, res) {
    db.scrapedNews.remove({ saved: true }, function (error, found) {
        if (error) {
            console.log(error);
        }
        else {
            res.json(found);
        }
    });
});

app.get("/api/fetch", function (req, res) {
    axios.get("https://news.ycombinator.com/").then(function (response) {
        var $ = cheerio.load(response.data);
        $(".title").each(function (i, element) {
            var title = $(element).children("a").text();
            var link = $(element).children("a").attr("href");

            if (title && link) {
                db.scrapedNews.save({
                    title: title,
                    link: link,
                    saved: false
                },
                    function (err, inserted) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            console.log(inserted);
                        }
                    });
            }
        });
        res.send("complete");
    });
});

app.put("/api/article/:id", function (req, res) {
    db.scrapedNews.findAndModify({
        query: { _id: mongojs.ObjectId(req.params.id) },
        update: { $set: { saved: true } },
        new: true
    }, function (err, doc, lastErrorObj) {
        res.json(doc);
    });
});

app.listen(PORT, function () {
    console.log("App running on port 8080!");
});
