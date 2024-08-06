var express = require("express");
var bodyparser = require("body-parser");
var mongoose = require("mongoose");
var Course = require("./models/course.model");
var cookieParser = require("cookie-parser");
var User = require("./models/user.model");

var app = express();
app.use(express.static(__dirname + "/public"));
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.set("view engine", "pug");
app.use(cookieParser());
var db = mongoose.connect(
  "mongodb+srv://sai:sai123456789@atlascluster.ym1yuin.mongodb.net/auth?retryWrites=true&w=majority&appName=AtlasCluster"
);

app.get("/", (req, res) => {
  db.then(() => {
    Course.find({})
      .then((courses) => {
        console.log(courses);
        res.render("courses", { courses });
      })
      .catch((err) => {
        console.log("errrorrrr", err);
      });
  }).catch((err) => {
    res.send("problem in connecting to database");
  });
});


app.get("/login", (req, res) => {
  if (req.query.username && req.query.password) {
    // mongoose.connect("mongodb+srv://sai:sai123456789@atlascluster.ym1yuin.mongodb.net/auth?retryWrites=true&w=majority&appName=AtlasCluster")
    db.then(() => {
      User.findOne({
        username: req.query.username,
        password: req.query.password,
      }).then((userdata) => {
        console.log(userdata);
        res.cookie("username", userdata.username);
        res.cookie("password", userdata.password);
        res.redirect("/");
      });
    }).catch((err) => {
      res.send(" problem in connecting to database");
    });
  }
});

app.post("/addcourse", (req, res) => {
  // console.log(req.body)
  // mongoose.connect("mongodb+srv://sai:sai123456789@atlascluster.ym1yuin.mongodb.net/auth?retryWrites=true&w=majority&appName=AtlasCluster")
  db.then(() => {
    var newCourse = new Course(req.body);
    newCourse.save().then((course) => {
      console.log(course);
      res.send("new course added");
    });
  }).catch((err) => {
    res.send("problem in connecting to database");
  });
});

app.get("/registercourse/:id", (req, res) => {
  // console.log(req.params.id)
  // mongoose.connect("mongodb+srv://sai:sai123456789@atlascluster.ym1yuin.mongodb.net/auth?retryWrites=true&w=majority&appName=AtlasCluster")
  db.then(() => {
    Course.findOne({ _id: req.params.id })
      // Course.findById(req.params.id)
      .then((course) => {
        console.log(course);
        res.render("coursedetails", { course });
      });
  }).catch((err) => {
    res.send("error in connecting in database");
  });
});

function authenticate(req, res, next) {
  if (req.cookies.username && req.cookies.password) {
    next();
  } else {
    res.redirect("/login.html");
  }
}

app.get("/register/:cid", authenticate, (req, res) => {
  // mongoose.connect("mongodb+srv://sai:sai123456789@atlascluster.ym1yuin.mongodb.net/auth?retryWrites=true&w=majority&appName=AtlasCluster")
  db.then(() => {
    User.findOneAndUpdate(
      { username: req.cookies.username, password: req.cookies.password },
      { $push: { courses: req.params.cid } }
    ).then((updatedUser) => {
      console.log(updatedUser);
      console.log(updatedUser.courses);
      res.send("course registered");
    });
  }).catch((err) => {
    res.send("err");
  });
});

app.get("/registeredcourses", authenticate, (req, res) => {
  // mongoose.connect("mongodb+srv://sai:sai123456789@atlascluster.ym1yuin.mongodb.net/auth?retryWrites=true&w=majority&appName=AtlasCluster")
  db.then(() => {
    User.findOne({
      username: req.cookies.username,
      password: req.cookies.password,
    })
    .then((user) => {
      Course.find({ _id: {$in:user.courses} })
       .then((coursesdata) => {
        console.log(coursesdata)
        res.render("registeredcourses", { coursesdata });
      });
    });
  }).catch((err) => {
    res.send("err in connecting database");
  });
});



app.listen(8090, () => {
  console.log("server is running on 8090 port");
});
