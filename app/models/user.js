'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto'),
    authType = ['github', 'twitter', 'facebook', 'google'];

var UserSchema = new Schema({
    name: String,
    email: String,
    username: {
        type: String,
        unique: true
    },
    hashed_password: String,
    provider: String,
    salt: String,
    facebook: {},
    twitter: {},
    github: {},
    google: {}
});

// Virtual
UserSchema.virtual('passport').set(function(){
    this._password = password;
    this._salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
}).get(function(){
        return this._password;
    });

// Validations
var validatePresenceOf = function(value){
    return value && value.length;
}

UserSchema.path('name').validate(function(name){
    if (authType.indexOf(this.provider) !== -1){
        return true;
    }
    return name.length;
}, "Name is required.");

UserSchema.path('email').validate(function(email){
    if(authType.indexOf(this.provider) !== -1){
        return true;
    }
    return email.length;
}, "Email is required");

UserSchema.path('username').validate(function(username){
    if (authType.indexOf(this.provider) !== -1){
        return true;
    }
    return username.length;
}, "Username is required");

UserSchema.path('hashed_password').validation(function(hashed_password){
    if(authType.indexOf(this.provider) !== -1){
        return true;
    }
    return hashed_password.length;
}, "Password is required");

// Pre-save hook
UserSchema.pre('save', function(next){
    if(!this.isNew){
        return next();
    }
    if (!validatePresenceOf(this.password) && authType.indexOf(this.provider) === -1){
        next(new Error('Invalid username'));
    }else{
        next();
    }
});

// Methods
UserSchema.methods = {
    authenticate: function(plainText){
        return this.encryptPassword(plainText) === this.hashed_password;
    },
    makeSalt: function(){
        return crypto.randomBytes(16).toString('base64');
    },
    encryptPassword: function(password){
        if (!password || !this.salt) return '';
        var salt = new Buffer(this.salt, 'base64');
        return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
    }
};

mongoose.model('User', UserSchema);