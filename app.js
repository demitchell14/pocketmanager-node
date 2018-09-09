const express       = require("express");
const path          = require("path");
const logger        = require("morgan");
const cookieParser  = require("cookie-parser");
const sassMiddleware= require('node-sass-middleware');
const expressSanitizer = require('express-sanitizer');
const app = express();
const session       = require("express-session");

// -- Routes
const IndexRoute    = require("./routes/index");
const ApiRoute      = require("./routes/api");


const DB            = require("./bin/database");
DB.init(DB.getConnectionOptions("dev"));

app.use(logger("dev"));
app.use(session({
    secret: "I'm just a string",
    resave: true,
    saveUninitialized: true,
    //cookie: { secure: true }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(expressSanitizer());
app.use(cookieParser());

const staticOptions = {
    index: 'test.html'
};
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', IndexRoute);
app.use('/v1/api', ApiRoute);

//app.use('/api', ApiRoute)


module.exports = app;
