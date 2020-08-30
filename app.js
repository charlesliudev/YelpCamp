var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	mongoose = require('mongoose');

mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true });

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);


// Campground.create({
// 	name: "Caribou Trail",
// 	image: "https://i.imgur.com/G8tOaeYg.png",
// 	description: "This is a huge Granite Hill. No bathroom. No water. Beautiful granite!"
// }, function(err, campground){
// 	if(err){
// 		console.log(err);
// 	} else{
// 		console.log('NEWLY CREATED CAMPGROUND: ');
// 		console.log(campground);
// 	}
// });


app.get("/", function(req, res){
	res.render("landing");
});

// INDEX: Show all campgrounds
app.get("/campgrounds", function(req, res){
	// Get all campgrounds from DB
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		} else{
			res.render("index", {campgrounds: allCampgrounds});
		}
	});
});

// CREATE: Add new campground DB
app.post("/campgrounds", function(req, res){
	var name = req.body.name;
	var image = req.body.image;
	var newCampground = {name: name, image: image};
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else{
			res.redirect("/campgrounds");
		}
	});
});

// NEW: Show form to create new campground
app.get("/campgrounds/new", function(req, res){
	res.render("new.ejs");
});

// SHOW: Show more info about each campground
app.get("/campgrounds/:id", function(req, res){
	// Get the campground by ID from DB
	var theID = req.params.id;
	Campground.findById(theID, function(err, foundCampground){
		if(err){
			console.log(err);
		} else{
			// Render the template with that campground
			res.render("show", {campground: foundCampground});
		}
	})
});


app.listen(3000, function(){
	console.log("YelpCamp has started running.");
});




