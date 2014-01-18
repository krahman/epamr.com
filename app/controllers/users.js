'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User');

exports.auth_callback = function(req, res){
    res.redirect('/');
}

exports.login = function(req, res){
    res.render = ('users/login', {
        title: 'LOGIN',
        message: req.flash('error')
    });
}

exports.register = function(req, res){
    res.render = ('users/register', {
        title: 'REGISTER',
        user: new User()
    });
}

exports.logout = function(req, res){
    req.logout();
    res.redirect('/');
}

exports.session = function(req, res){
    res.redirect('/');
}

exports.create = function(req, res, next){
    var user = new User(req.body);
    var message = null;

    user.provider = 'local';
    user.save = function(err){
        if (err){
            switch(err.code){
                case 11000:
                case 11001:
                    message = "Username already exists";
                    break;
                default:
                    message = "Please fill all the required fields";
            }
            return res.render('users/register', {
                message: message,
                user: user
            });
        }
        req.logIn(user, function(err){
            if (err) return next(err);
            return res.redirect('/');
        })
    };
}

exports.me = function(req, res){
    res.jsonp(req.user || null);
}

exports.user = function(req, res, next, id){
    User
        .findOne({
            _id: id
        })
        .exec(function(err, user){
            if (err) return next(err);
            if (!user) return next(new Error('Failed to load User ' + id));
            req.profile = user;
            next();
        });
}