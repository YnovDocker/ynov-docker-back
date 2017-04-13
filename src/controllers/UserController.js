/**
 * Created by Antoine on 08/04/2017.
 */
/* jshint node: true */
/*jshint esversion: 6 */
'use strict';
let util = require('util'),
    mongoose = require('mongoose'),
    logger = require('log4js').getLogger('controller.user'),
    _ = require('lodash'),
    sanitizer = require('sanitizer'),
    UserDB = require('../models/User'),
    User = mongoose.model('User');

module.exports = {
		register: register,
		verifyEmail: verifyEmail
};

//Path: GET api/users
function getUsers(req, res, next) {
    logger.info('Getting all users from db...');

    //TODO add size param handling => see how to get the query params (using url package)
    // Code necessary to consume the User API and respond
    User.find({})
        .populate('address')
        .exec(function (err, users) {
            if (err)
                return next(err);

            if (_.isNull(users) || _.isEmpty(users)) {
                res.set('Content-Type', 'application/json');
                res.status(404).json({error: "Couldn't gets users"}, null, 2);
            }
            else {
                res.set('Content-Type', 'application/json');
                res.end(JSON.stringify(users || {}, null, 2));
            }
        });
};

//Path: POST  /user/register
function register(req, res, next) {
    logger.info('Adding new user...');
    //check if email isn't already taken
    //UserService.alreadyTakenEmail(req, function (err, isAlreadyTakenEmail) {
       //if (!isAlreadyTakenEmail) {
            //TODO check password difficulty(later)
            //TODO check phone number(later)
        if(req.swagger.params.userToAdd.value.password === req.swagger.params.userToAdd.value.passwordConfirmation) {
            let user = new User({
                firstname: sanitizer.escape(req.swagger.params.userToAdd.value.firstname),
                lastname: sanitizer.escape(req.swagger.params.userToAdd.value.lastname),
                username: sanitizer.escape(req.swagger.params.userToAdd.value.username),
                birthDate: sanitizer.escape(req.swagger.params.userToAdd.value.birthDate),
                email: sanitizer.escape(req.swagger.params.userToAdd.value.email),
                password: sanitizer.escape(req.swagger.params.userToAdd.value.password),
                //address: [],
                //phoneNumber: sanitizer.escape(req.body.phoneNumber),
                //friends: []
            });

            user.save(function (err, user) {
                if (err) {
                    logger.error("got an error while creating user: ", err);
                    return next(err);
                }

                if (_.isNull(user) || _.isEmpty(user)) {
                    res.set('Content-Type', 'application/json');
                    res.status(404).json({error: 'Error while creating user'} || {}, null, 2);
                }
                //user saved, now sending email
                else {
                    //if email sendOnUserAdd activated in config, sending account validation email
                    /*if (config.server.features.email.sendOnUserAdd) {
                     var mailOpts = config.server.features.email.smtp.mailOpts;

                     logger.debug("sendOnUserAdd config: " + JSON.stringify(mailOpts));
                     logger.debug("sending email....");

                     require('crypto').randomBytes(48, function (err, buffer) {
                     var token = buffer.toString('hex');*/

                    //send email
                    /*emailUtils.dispatchAccountValidationLink(mailOpts, user, token, function (err, user) {
                     if (err) {
                     return next(err);
                     }
                     else {*/
                    res.set('Content-Type', 'application/json');
                    res.status(200).end(JSON.stringify(user || {}, null, 2));
                    //}
                    //});
                    //});
                }
                /*else {//else returning user directly
                 res.set('Content-Type', 'application/json');
                 res.status(200).end(JSON.stringify(user || {}, null, 2));
                 }*/
                //}
            });
            //}
            /*else {
             res.set('Content-Type', 'application/json');
             res.status(401).end(JSON.stringify({error: 'Email already used'} || {}, null, 2));
             }*/
            //});
        }
        else
        {
            res.set('Content-Type', 'application/json');
            res.status(400).json({
                    errorMessage: 'password and confirmPassword is not equal',
                    errorCode: 'E_PWD_NOT_EQUAL'
            } || {}, null, 2);
        }
};

function verifyEmail(req, res) {
		// variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
		// let username = req.swagger.params.userToAdd1;
		// console.log("name: " + JSON.stringify(username));
		// this sends back a JSON response which is a single string
		res.set('Content-Type', 'application/json');
		res.status(501).end(JSON.stringify({status: 501, message: "Not implemented yet"} || {}));
}