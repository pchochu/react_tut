const Authentication = require('./controllers/authentication')
const passportService = require('./services/passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', {session: false});
const requireSignin = passport.authenticate('local', {session: false});

module.exports = function(app){
    //first argument is route that we are trying to handle
    // functions is called with three arguments
    //req - data about the request that was made
    //res - response that we are gonna formup and send back
    //next - mostly for error handeling
    // app.get('/', function(req, res, next){
    //     res.send(['water', 'bottle', 'phone', 'paper']);
    // });
    app.get('/', requireAuth, function(req, res){
        res.send({hi: 'there'});
    })
    app.post('/signin', requireSignin, Authentication.signin);
    app.post('/signup', Authentication.signup);
}