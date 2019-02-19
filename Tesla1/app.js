var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/Login');
var db = mongoose.connection;

var routes = require('./routes/index');
var users = require('./routes/users');
var blog = require('./routes/blog');
var shop = require('./routes/shop');
var adminRoute = require('./routes/adminPage');
var categoryblog = require('./routes/categoryblog');

//Init App
var app = express();

//View Engine
app.set('views',path.join(__dirname,'views'));
app.engine('handlebars',exphbs({defaultLayout: 'layout'}));
app.set('view engine','handlebars');

//BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());

//Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

//Express session
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave:true
}));

//Passport Init
app.use(passport.initialize());
app.use(passport.session());

//Express validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value){
    var namespace = param.split('.')
    , root = namespace.shift()
    , formParam = root;

    while(namespace.length){
      formParam += '['+ namespace.shift()+ ']';
    }
  return {
    param: formParam,
    msg: msg,
    value: value
  };
  }
}));

//Connect flash
app.use(flash());

//Global vars
app.use(function(req,res,next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});


app.use('/admin',adminRoute);
app.use('/',routes);
app.use('/users',users);
app.use('/blog',blog);
app.use('/shop',shop);
app.use('/categoryblog',categoryblog);



//Set Port
app.set('port',(process.env.PORT || 3000));

app.listen(app.get('port'),function(){
  console.log('Server started on port ' + app.get('port'));
});
