const mongoose = require('mongoose');

//to tell mongo about models that our app is going to use
const Schema = mongoose.Schema;

const bcrypt = require('bcrypt-nodejs')

//Define our model
//Email has to be unique
const userSchema = new Schema({
    email: { type: String, unique: true, lowercase: true },
    password: String  
});

// On Save Hook, encrypt password
// Before saving a model, run this function
userSchema.pre('save', function(next){
    // getting acces to the user model
    const user = this; // user.email, user.password

    // generate a salt then run callback
    bcrypt.genSalt(10, function(err, salt){
        if(err) { return next(err); }

        //hash our password using the salt
        bcrypt.hash(user.password, salt, null, function(err, hash){
            if(err) { return next(err)}

            //override plain text password with encrypted password
            user.password = hash;
            //go ahead and save the user
            next();
        });
    });
});

userSchema.methods.comparePassword = function (candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        if(err) {return callback(err); }

        callback(null, isMatch);
    })
}

//Create the model class
const ModelClass = mongoose.model('user', userSchema);

//Export the model
module.exports = ModelClass;