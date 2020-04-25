

//require
var express = require("express");  //express framework
var bodyParser = require("body-parser");
var ejs = require("ejs");
var methodOverride = require("method-override");
var mongoose = require("mongoose");

//use
var app = express();
app.use( bodyParser.urlencoded({extended: true}) );
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

//database

var url = process.env.DATABASEURL || "mongodb://localhost/blogDB"
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true} );

var blogSchema = new mongoose.Schema({"title": String, "image": String, "body": String,  "created": {"type": Date, "default": Date.now}});  
var Blog = mongoose.model("Blog", blogSchema);


//root
app.get("/", function(req, res){
	res.redirect("/blogs");
});

//Index
app.get("/blogs", function(req, res){
	Blog.find({}, function(err, blogs){
		if (err) console.log(err);
		else {
           res.render("index", {"blogs": blogs});
		}
	});
});

//New
app.get("/blogs/new", function(req, res){
	res.render("new");
});

//Create
app.post("/blogs", function(req, res){
	var userInput = {
		"image": req.body.image,
		"title": req.body.title,
		"body": req.body.body
	}
	var userInputSubmit = new Blog({"title": userInput["title"], "image": userInput["image"], "body": userInput["body"]});
	userInputSubmit.save();
	res.redirect("/blogs");
})

//Show
app.get("/blogs/:id", function(req, res){
	var paramsUrl = req.params.id;
	Blog.findOne({"_id": paramsUrl}, function(err, blog){
		if (err){
			//If there's potential error
			console.log(err);
			res.redirect("/blogs/new");
		}
		else {
			res.render("show", {"blog": blog});
		}
	});
});

//Edit
app.get("/blogs/:id/edit", function(req, res){
	var paramsUrl = req.params.id;
	Blog.findOne({"_id": paramsUrl}, function(err, blog){
		if(err) {
			//If there's potential error
			console.log(err);
		}
		else {
        	res.render("edit", {"blog": blog});
		}
	});
});

//Update
app.put("/blogs/:id", function(req, res){
	var paramsUrl = req.params.id;
	var userInputSubmit = {"title": req.body.title,
                           "image": req.body.image,
                           "body": req.body.body
                     }
	
	Blog.findOneAndUpdate({"_id": paramsUrl}, userInputSubmit, function(err, blog){
		if(err) {
			//If there's potential error
			console.log(err);
		}
		else {
			res.redirect("/blogs/" + paramsUrl);
		}
	});
});

//Delete
app.delete("/blogs/:id", function(req, res){
	var paramsUrl = req.params.id;
	Blog.findOneAndRemove({"_id": paramsUrl}, function(err){
		if(err) {
			//If there's potential error
			console.log(err);
		}
		else {
			res.redirect("/blogs");
		}
	});
});


app.listen(process.env.PORT || 3000, function(){
	console.log(".");
	console.log(".");
	console.log(".");
	console.log("Blog server started");
});

//end




