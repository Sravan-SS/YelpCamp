if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const MongoStore = require("connect-mongo");
const path = require("path");
const ExpressError = require("./utils/ExpressError");
const User = require("./models/user");
const campgroundRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/users");
const { CSPDirectives } = require("./CSP");
const app = express();
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/yelp-camp";

const secret = process.env.SECRET || "thisshouldbeabettersecret!";

// mongodb://localhost:27017/yelp-camp
mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedtopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error"));
db.once("open", () => {
  console.log("Database Connected");
});

// connect-mongo(MongoStore)
const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 60 * 60,
  crypto: {
    secret,
  },
});

store.on("error", function (e) {
  console.log("SESSION STORE ERROR", e);
});

// ejs
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));

// body parser
app.use(express.urlencoded({ extended: true }));

// method override
app.use(methodOverride("_method"));

// public directory
app.use(express.static(path.join(__dirname, "public")));

// mongo sanitize
// *we can also replace characters instead of removing it completely
app.use(mongoSanitize());

// helmet
app.use(
  helmet.contentSecurityPolicy({
    directives: CSPDirectives,
  })
);

// session (server side cookies)
const sessionConfig = {
  store, // store:store
  name: "session",
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // *over https only
    // secure: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
  // store:
};
app.use(session(sessionConfig));

// passport (authentication)
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// flashing messages
app.use(flash());
app.use((req, res, next) => {
  console.log(req.session);
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// routes
app.get("/", (req, res) => {
  res.render("home");
});

app.use("/", userRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh No, Something Went Wrong!!";
  res.status(statusCode).render("error", { err });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Serving On Port ${port}`);
});
