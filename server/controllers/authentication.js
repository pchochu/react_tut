const jwt = require('jwt-simple');
const config = require('../config');
const User = require('../models/user');

function tokenForUser(user){
    const timestamp = new Date().getTime()
    //createing jwt with payload sub and iat
    return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signin = (req, res, next) => {
    // User has already had their email and password auth'd
    // We just need to give them a token
    res.send({ token: tokenForUser(req.user)})
}

exports.signup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    if(!email || !password){
        return res.status(422).send({error: "You must provide a password and email"})
    }

    //See if a user with a given email exists
    User.findOne({ email: email}, function(err, existingUser) {
        if(err) { return next(err); }
        
        //If a user with email does exists, return an error
        if(existingUser){
            return res.status(422).send({error: 'Email is in use'});
        }

        //If a user with email does not exists, create and save user recod
        const user = new User({
            email: email,
            password: password
        });

        user.save(function(err) {
            if(err) { return next(err) }

            //Respond to request indicating the user was created
            res.json({ token: tokenForUser(user) })
        });
    });
}