
module.exports = function(app) {

    var passport = require('passport');
    var flash = require('connect-flash');
    var mongoose = require('mongoose');
    var LocalStrategy = require('passport-local').Strategy;



    var user = require('../models/usermodel.js');
    var User = mongoose.model('User');

    var session = require('express-session');
    var MongoStore = require('connect-mongo')(session);

    app.set('trust proxy', 1);
    app.use(session({
        store: new MongoStore({
            url: 'mongodb://localhost/recipes'
         }),
        secret: 'FoodieAppsecret',
        resave:false,
        saveUninitialized:true,
        cookie: {secure: true}
    }));

    app.use(passport.initialize());

    app.use(passport.session());


    passport.use(new LocalStrategy(
        function (username, password, done) {

            User.findOne({username: username}, function (err, user) {

                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false, {alert: 'Incorrect username.'});
                }
                if (user.password != password) {
                    return done(null, false, {alert: 'Incorrect password.'});
                }
                return done(null, user);
            });
        }

    ));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
             done(err, user);
        });
    });

    function isAuthenticated(req,res,next){
        if(req.isAuthenticated())return next();
         res.redirect('/');
    }


    app.post('/auth/login', passport.authenticate('local'),function(req, res){
        res.json(req.user);
    });


    app.get('/auth/currentuser',isAuthenticated,function(req,res){
        res.json(req.user);
    });

    app.post('/auth/signup',function(req,res){


                var u = new User();
                u.email = req.body.username;
                u.password = req.body.password;
                u.username = req.body.username;


                u.save(function (err) {
                    if (err){
                        res.json({'alert':'Registration error'});
                    }else{
                        res.json({'alert':'Registration success'});
                    }
                });
                });


     app.get('/auth/logout', function(req, res){
         console.log('logout');
        req.logout();
        res.sendStatus(200);
     });

};