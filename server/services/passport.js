const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

//strategies are plugins for passport, that we want to use for 
//certain purpouse

//Create local strategy
//by default LocalStrategy looks for username, but we provide an email
const localOptions = {usernameField: 'email'}
const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
    // Verify this email and password, call done with the user
    // if it is the correct username and password
    // otherwise call done with false
    User.findOne({ email: email }, (err, user) => {
        if(err) { return done(err); }
        if(!user) { return done(null, false); }

        //compare password - is 'password' equal to user.password?
        user.comparePassword(password, function (err, isMatch) {
            console.log(0)
            if(err) {return done(err)}
            console.log(1)
            if(!isMatch) { return done(null, false)}
            console.log(2)
            return done(null, user);
        })
    })
});

//setup options for JWT strategy
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.secret
};

//create JwT strategy
const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
    // See if the user ID in the payload exists in our DB
    // If it does, call 'done' with that user, otherwise, 
    // call done without a user
    User.findById(payload.sub, (err, user) => {
        if(err) { return done(err, false); }

        if(user) {
            done(null, user);
        } else {
            done(null, false);
        }
    });

});

//Tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);