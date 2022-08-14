const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
//when request to page, will show in console in dev mode
const morgan = require("morgan");
const exphbs = require("express-handlebars");
const passport = require("passport");
const session = require("express-session");
const connectDB = require("./config/db");

//Load config
dotenv.config({ path: "./config/config.env" });

//Passport config
require("./config/passport")(passport);

//Connect DB
connectDB();

//initialize
const app = express();

//logging - only use morgan in dev mode
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//HANDLEBARS - template engine
app.engine(".hbs", exphbs.engine({ defaultLayout: "main", extname: ".hbs" }));
app.set("view engine", ".hbs");

//Sessions
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
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

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
