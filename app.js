const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
//when request to page, will show in console in dev mode
const morgan = require("morgan");
const exphbs = require("express-handlebars");
const passport = require("passport");
const session = require("express-session");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const connectDB = require("./config/db");

//Load config
dotenv.config({ path: "./config/config.env" });

//Passport config
require("./config/passport")(passport);

//Connect DB
connectDB();

//initialize
const app = express();

//Body parser middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//logging - only use morgan in dev mode
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//Handlebars Helpers
const { formatDate } = require("./helpers/hbs");

//HANDLEBARS - template engine
app.engine(
  ".hbs",
  exphbs.engine({
    helpers: {
      formatDate,
    },
    defaultLayout: "main",
    extname: ".hbs",
  })
);
app.set("view engine", ".hbs");

//Sessions
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    //store session in mongoDB to prevent kicking on server restart
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  })
);

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Static folder
app.use(express.static(path.join(__dirname, "public")));

//Routes
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/characters", require("./routes/characters"));

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
