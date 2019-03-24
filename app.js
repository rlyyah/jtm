var bodyParser = require("body-parser"),
    mongoose   = require("mongoose"),
    express    = require("express"),
    methodOverride = require("method-override"),
    faker = require("faker"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose");
    
var Event = require("./models/events");   
var Member = require("./models/members");
var User = require("./models/user");
    
var app = express();

//LOCAL HOST DB

/*mongoose.connect('mongodb://localhost/JTM').then(() => {
console.log("Connected to Database");
}).catch((err) => {
    console.log("Not Connected to Database ERROR! ", err);
});*/


//INET DB



mongoose.connect('mongodb://jtmadmin:WnqCjmB7pWWNXq8@ds139459.mlab.com:39459/jtm').then(() => {
console.log("Connected to Database");
}).catch((err) => {
    console.log("Not Connected to Database ERROR! ", err);
});






app.set("view engine", "ejs");
//assets in 1 directory
app.use(express.static("public"));
//now we can steal from forms!
app.use(bodyParser.urlencoded({extended:true}));
//Making put and delete routes work
app.use(methodOverride("_method"));

app.use(require("express-session")({
    secret: "Tomasz jest super",
    resave: false,
    saveUninitialized: false
}));

//Setting passport up!
app.use(passport.initialize());
app.use(passport.session());

//Reading encoded data and uncoding it
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/*Event.create({
    title: "title being title",
    content: "Lorem impusm amet, consectetur adipiscing elit. Viverra quam et, hendrerit. Lorem impusm amet.  Viverra quam et, hendrerit. Lorem impusm amet, consectetur adipiscing elit. Viverra quam et, hendrerit...",
    img: "https://images.pexels.com/photos/950902/pexels-photo-950902.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
}, function(err, createdEvent){
    if(err){
        console.log(err);
    }else{
        console.log(createdEvent);
    }
});*/

/*for(var i = 0; i<30; i++){
    Member.create({
        name: faker.name.findName()
    }, function(err, createdMember) {
        if(err){console.log(err);
            
        }else{
            console.log(createdMember);
        }
    });
};*/


//======================\\
//========ROUTES========\\
//======================\\

app.get("/", function(req, res){
   Event.find({}, function(err, foundEvent){
      if(err){
          console.log(err);
          res.redirect("/");
      } else{
           Member.find({}, function(err, foundMember) {
              if(err){console.log(err);
                  
              }else{
                  res.render("index", {event:foundEvent, member:foundMember});
              }
           }); 
      }
   }); 
});

app.get("/adminpaneljtm", isLoggedIn, function(req, res) {
    Event.findById(req.params.id, function(err, foundEvent){
       if(err){
           console.log(err);
       }else{
           res.render("adminpanel");
       }
    });
    
    
});

app.get("/news", function(req, res){
   Event.find({}, function(err, foundEvent){
      if(err){
          console.log(err);
          res.redirect("/");
      } else{
         res.render("partials/news", {event:foundEvent}); 
      }
   });
   
});



app.get("/news/add", isLoggedIn, function(req, res) {
    res.render("addnews");
});

app.post("/news", isLoggedIn, function(req, res){
   Event.create(req.body.event, function(err, createdEvent){
      if(err){
          console.log(err);
      }else{
          res.redirect("/news");
      } 
   }); 
});


app.get("/news/:id", function(req, res) {
    Event.findById(req.params.id, function(err, foundEvent) {
        if(err){
            console.log(err);
        }else{
            res.render("shownews", {event:foundEvent});
        }
    });
});

app.get("/news/:id/edit", isLoggedIn, function(req, res) {
    Event.findById(req.params.id, function(err, foundEvent){
       if(err){
           console.log(err);
       }else{
           res.render("editnews", {event:foundEvent});
       }
    });
    
    
});
app.put("/news/:id", isLoggedIn, function(req, res){
   Event.findByIdAndUpdate(req.params.id ,req.body.event, function(err, updatedEvent){
       if(err){
           console.log(err);
       }else{
           res.redirect("/news/" + req.params.id);
       }
   });
});
app.get("/news/:id/delete", isLoggedIn, function(req, res) {
    Event.findById(req.params.id, function(err, foundEvent) {
        if(err){
            console.log(err);
        }else{
            res.render("deletenews", {event:foundEvent});
        }
    });
    
});

app.delete("/news/:id", isLoggedIn, function(req, res){
    Event.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
        }else{
            res.redirect("/news");
        }
    });
});

app.get("/members", isLoggedIn, function(req, res) {
    Member.find({}, function(err, foundMember) {
              if(err){console.log(err);
                  
              }else{
                  res.render("showmembers", {member:foundMember});
              }
           }); 
    
});
app.get("/members/add", isLoggedIn, function(req, res) {
    res.render("addmembers");
});
app.post("/members", isLoggedIn, function(req, res){
   Member.create(req.body.member,function(err, createdMember){
      if(err){
          console.log(err);
      }else{
          res.redirect("/members");
      } 
   }); 
});
app.delete("/members/:id", isLoggedIn, function(req, res){
    Member.findByIdAndRemove(req.params.id, function(err, deletedMem){
        if(err){
            console.log(err);
        }else{
            
            res.redirect("/members");
        }
    });
});

app.get("/register", function(req, res) {
    res.render("register");
});

app.post("/register", function(req, res) {

   User.register(new User({username: req.body.username}), req.body.password, function(err, user){
       if(err){
           console.log(err);
           return res.redirect("register");
       }
        passport.authenticate('local')(req, res, function(){
        res.redirect('/members');
       });
       
   });
});

app.get("/login", function(req, res) {
    res.render("login");
});
app.post("/login", passport.authenticate("local", {
    successRedirect: "/members",
    failureRedirect: "/login"
}) , function(req, res) {
});

app.get("/logout", function(req, res) {
   req.logout(); 
   res.redirect("/login");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}





app.listen(process.env.PORT, process.env.IP, function(){
    console.log("3..."); 
    console.log("2...");
    console.log("1..."); 
    console.log("1..."); 
    console.log("Server has started!"); 
});