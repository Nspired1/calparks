if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

const express = require('express');
const app = express();
const session = require("express-session");
const flash = require('connect-flash');
const path = require('path');
const mongoose = require("mongoose");
const Park = require("./models/park");
const Review = require("./models/review");
const User = require('./models/user');
const parkJoiSchema = require('./utils/parkJoiSchema');
const reviewJoiSchema = require('./utils/reviewJoiSchema');
const ExpressError = require("./utils/ExpressError");
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require("helmet");
const methodOverride = require("method-override");
const morgan = require('morgan');
const ejsMate = require('ejs-mate');
const cookieParser = require('cookie-parser');
const  MongoDBStore  = require('connect-mongodb-session')(session);

// auth libraries
const passport = require('passport');
const LocalStrategy = require('passport-local');

// env variables
const PORT = process.env.PORT || 3001;
const IP = process.env.IP;

//====== set view preferences =======//
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//===== use npm libraries and assets ======//
app.use(express.urlencoded({ extended: true }));
//console logger for errors in development 
app.use(morgan('dev'));
//use public folder for static assets
app.use(express.static(path.join(__dirname, 'public')));
// enable DELETE and PUT http requests
app.use(methodOverride('_method'));

//=== configure session options. Time in milliseconds. ===//
const sessionOptions = { 
    name: 'session',
    secret: process.env.SESSION_SECRET, 
    resave:'false', 
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionOptions));

//use flash to display one-time messages with sessions
app.use(flash());

// passport sessions MUST be AFTER sessions are used
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=> {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// remove unauthorize data from user requests to prevent noSQL injection attacks
app.use(mongoSanitize({
    replaceWith: '_'
}))

//==== database setup and link =====//

// on MongoDB Atlas
const databaseUrl = process.env.DB_URL;
// on localhost
const localDatabaseLink = 'mongodb://localhost:27017/calparks';

const store = new MongoDBStore({
    url: databaseUrl,
    secret: 'notagoodsecret',
    touchAfter: 24 * 3600 // time in seconds
})

store.on("error", function (e){
    console.log("SESSION STORE ERROR", e)
});

// mongoose settings
mongoose.connect(localDatabaseLink, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const databaseLink = mongoose.connection;
databaseLink.on("error", console.error.bind(console, "connection error:"));
databaseLink.once("open", ()=> {
    console.log("Database Connected from App.js!");
});

// routes prefix
const usersRoutes = require('./routes/users');
const parksRoutes = require("./routes/parks");
const reviewsRoutes = require("./routes/reviews");

//----- routes ------//

// GET homepage
app.get('/', (req, res)=> {
    res.render('home')
});

//note: parksRoutes is the variable that holds the url paths for PARKS
//note: reviewsRoutes is the variable that holds the url paths for REVIEWS
app.use("/", usersRoutes);
app.use("/parks", parksRoutes);
app.use("/parks/:id/reviews", reviewsRoutes);

//error 
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

//response for errors. Default is 500 and 'Sorry. Something went wrong'
app.use((err, req, res, next) => {
    const {statusCode = 500 } = err;
    if(!err.message) err.message = 'Oops. Seems like something went wrong.'
    res.status(statusCode).render('error', {err});
});

//to start app at command prompt type "nodemon app.js" or "node app.js"
app.listen(PORT, () => {
    console.log(`App is running and listening intently on ${PORT} and ${IP}`);
});

