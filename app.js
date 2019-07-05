// DECLARE VARIABLES
var bodyParser       = require("body-parser"),
	methodOverride   = require("method-override"),
	expressSanitizer = require("express-sanitizer"),
	mongoose         = require("mongoose"),
	express          = require("express"),
	app              = express();

// APP CONFIG
mongoose.connect("mongodb://localhost/blog_app", { useNewUrlParser: true });
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

// MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: 
		{
			type: Date, 
			default: Date.now
		}
});

var Blog = mongoose.model("Blog",blogSchema);

// ROUTES

app.get("/",function(req,res){
	res.redirect("/blogs");
});
// INDEX ROUTE
app.get("/blogs",function(req,res){
	Blog.find({},function(err,blogs){
		if(err){
			console.log(err);
		}
		else{
			res.render("index",{blogs: blogs});
		}
	});
	
});

// NEW ROUTE
app.get("/blogs/new",function(req,res){
	res.render("new");
});

// CREATE ROUTE
app.post("/blogs",function(req,res){
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.create(req.body.blog,function(err,newBlog){
		if(err){
			console.log(err);
			res.redirect("/new");
		}
		else{
			res.redirect("/blogs");
		}
	});
});

// SHOW ROUTE
app.get("/blogs/:id",function(req,res){
	Blog.findById(req.params.id,function(err,blog){
		if(err){
			console.log(err);
			res.redirect("/blogs");
		}
		else{
			res.render("show",{blog: blog});
		}
	})
});

// EDIT ROUTE
app.get("/blogs/:id/edit",function(req,res){
	Blog.findById(req.params.id,function(err,blog){
		if(err){
			console.log(err);
			res.redirect("/blogs");
		}
		else{
			res.render("edit",{blog: blog});
		}
	});
});

// UPDATE ROUTE
app.put("/blogs/:id",function(req,res){
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err){
		if(err){
			console.log(err);
			res.redirect("/blogs");
		}
		else{
			res.redirect("/blogs/"+req.params.id);
		}
	});
});

// DELETE ROUTE
app.delete("/blogs/:id",function(req,res){
	Blog.findByIdAndRemove(req.params.id,function(err,deletedBlog){
		if(err){
			res.redirect("/blogs/"+req.params.id);
		}
		else{
			res.redirect("/blogs");
		}
	});
});

// SERVER SETUP
app.listen(1234,function(req,res){
	console.log("Blog App listening on port 1234....");
});


