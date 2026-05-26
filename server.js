// SECTION 1: Dependencies
const express = require('express');
const expressSession = require('express-session');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const multer = require('multer')

require('dotenv').config();
const connectDb = require('./config/db')

//Import user model
const Registration = require('./model/Signup');
const Signup = require('./model/Signup');

// SECTION 2: Instantiations
const app = express();
const port = 3000;

// SECTION 3: Configurations
connectDb();
// set the templating engine to pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname,'views'));


// SECTION 4: Middleware
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
//Express configurations
app.use(expressSession({
  secret:"secret",
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());




//passport configurations
passport.use(Signup.createStrategy());
passport.serializeUser(Signup.serializeUser());
passport.deserializeUser(Signup.deserializeUser());

//Global variable to make thre logged in user available to all pug templates
app.use((req,res,next)=>{
  res.locals.user = req.user || null
  next();
})

9// SECTION 5: Routes
app.use('/',require('./routes/authRoutes'));
app.use('/',require('./routes/dashboardRoutes'))



// Second last chunk of code in this file ever
// Handling non-existent routes
app.use((req, res) => {
  res.status(404).send('Oops! Route not found.');
});

// SECTION 6: Bootstrapping Server
// Last line of code in this file ever because it's responsible for running the server.
app.listen(port, () => console.log(`listening on port ${port}`));



