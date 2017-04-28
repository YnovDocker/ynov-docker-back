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
    getUsers: getUsers,
    getUserById: getUserById,
    getUserByUsername: getUserByUsername,
    register: register,
    deleteUser: deleteUser,
    updateUser: updateUser,
    updatePassword: updatePassword
};

//Path: GET api/users
function getUsers(req, res, next) {
    logger.info('Getting all users from db...');
    //TODO add size param handling => see how to get the query params (using url package)
    // Code necessary to consume the User API and respond
    User.find({})
    //.populate('address')
        .exec(function (err, users) {
            if (err)
                return next(err);

            if (_.isNull(users) || _.isEmpty(users)) {
                res.set('Content-Type', 'application/json');
                res.status(404).json({
                    errorMessage: "Couldn't gets users",
                    errorCode: "E_NO_USERS_FOUND"
                }, null, 2);
            }
            else {
                res.set('Content-Type', 'application/json');
                res.end(JSON.stringify(users || {}, null, 2));
            }
        });
}

// Path: GET api/users/{userId}/getUserById
function getUserById(req, res, next) {
    logger.debug('BaseUrl:' + req.originalUrl);
    logger.debug('Path:' + req.path);

    logger.info('Getting the user with id:' + req.swagger.params.userId.value);

    if (req.swagger.params.userId.value.length >= 12) {
        // Code necessary to consume the User API and respond
        User.findById(req.swagger.params.userId.value)
            .exec(function (err, user) {
                if (err)
                    return next(err);
                if (_.isNull(user) || _.isEmpty(user)) {
                    res.set('Content-Type', 'application/json');
                    res.status(404).json({
                            errorMessage: 'User not found',
                            errorCode: 'E_USER_NOT_FOUND'
                        } || {}, null, 2);
                }
                else {
                    res.set('Content-Type', 'application/json');
                    res.status(200).end(JSON.stringify(user || {}, null, 2));
                }
            });
    }
    else {
        res.set('Content-Type', 'application/json');
        res.status(404).json({
                errorMessage: 'Not in objectId',
                errorCode: 'E_NOT_ID'
            } || {}, null, 2);
    }
}

// Path: GET api/users/{username}/getUserByUsername
function getUserByUsername(req, res, next) {
    logger.debug('BaseUrl:' + req.originalUrl);
    logger.debug('Path:' + req.path);

    logger.info('Getting the user with username:' + req.swagger.params.username.value);
    // Code necessary to consume the User API and respond

    User.findOne({username: req.swagger.params.username.value})
        .exec(function (err, user) {
            if (err)
                return next(err);

            if (_.isNull(user) || _.isEmpty(user)) {
                res.set('Content-Type', 'application/json');
                res.status(404).json({
                        errorMessage: 'User not found',
                        errorCode: 'E_USER_NOT_FOUND'
                    } || {}, null, 2);
            }
            else {
                res.set('Content-Type', 'application/json');
                res.status(200).end(JSON.stringify(user || {}, null, 2));
            }
        });
}


//Path: POST  /user/register
function register(req, res, next) {
    logger.info('Adding new user...');
    //check if email isn't already taken
    User.alreadyTakenEmail(sanitizer.escape(req.swagger.params.userToAdd.value.email), function (err, isAlreadyTakenEmail) {
        if (!isAlreadyTakenEmail) {

            if (req.swagger.params.userToAdd.value.password === req.swagger.params.userToAdd.value.passwordConfirmation) {
                let user = new User({
                    firstname: sanitizer.escape(req.swagger.params.userToAdd.value.firstname),
                    lastname: sanitizer.escape(req.swagger.params.userToAdd.value.lastname),
                    username: sanitizer.escape(req.swagger.params.userToAdd.value.username),
                    birthDate: sanitizer.escape(req.swagger.params.userToAdd.value.birthDate) || null,
                    email: sanitizer.escape(req.swagger.params.userToAdd.value.email),
                    password: sanitizer.escape(req.swagger.params.userToAdd.value.password),
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
                        //TODO sendMailConfirmation
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
                });
            }
            else {
                res.set('Content-Type', 'application/json');
                res.status(400).json({
                        errorMessage: 'password and confirmPassword is not equal',
                        errorCode: 'E_PWD_NOT_EQUAL'
                    } || {}, null, 2);
            }
        }
        else {
            res.set('Content-Type', 'application/json');
            res.status(401).end(JSON.stringify({
                    errorMessage: 'Email already used',
                    errorCode: 'E_EMAIL_USED'
                } || {}, null, 2));
        }
    });
}

//TODO
// Path: PUT api/users/{userId}/updateUser
function updateUser(req, res, next) {
    User.findOneAndUpdate(
        {_id: req.swagger.params.userId.value},
        {
            $set: {
                //TODO add phone number check
                firstname: sanitizer.escape(req.swagger.params.userToUpdate.value.firstname),
                lastname: sanitizer.escape(req.swagger.params.userToUpdate.value.lastname),
                username: sanitizer.escape(req.swagger.params.userToUpdate.value.username),
                birthDate: sanitizer.escape(req.swagger.params.userToUpdate.value.birthDate),
                email: sanitizer.escape(req.swagger.params.userToUpdate.value.email),
                updated_at: Date.now()
            }
        },
        {new: true}, //means we want the DB to return the updated document instead of the old one
        function (err, updatedUser) {
            if (err)
                return next(err);
            else {
                logger.debug("Updated game object: \n" + updatedUser);
                res.set('Content-Type', 'application/json');
                res.status(200).end(JSON.stringify(updatedUser || {}, null, 2));
            }
        });
}

// Path : PUT /users/{userId}/updatePassword
function updatePassword(req, res, next) {
    logger.info('Updating password for user with id:\n ' + req.swagger.params.userId.value);

    let userOldPassword = req.swagger.params.changePwdObject.value.oldPassword;
    let newPassword = req.swagger.params.changePwdObject.value.newPassword;
    let newPasswordConfirmation = req.swagger.params.changePwdObject.value.confirmNewPassword;
    logger.debug('userPassword object:' + userOldPassword);
    logger.debug('newPassword object:' + newPassword);

    User.findById(
        req.swagger.params.userId.value,
        function (err, user) {
            if (err)
                return next(err);

            // test for a matching password
            user.comparePassword(userOldPassword, function (err, isMatch) {
                if (err) return next(err);

                // check if the password was a match
                if (isMatch) {
                    //logger.debug('It\'s a match !');
                    if (newPassword === newPasswordConfirmation) {
                        user.saltPassword(newPassword, function (err, saltedNewPassword) {
                            logger.debug('saltedNewPassword:' + saltedNewPassword);
                            user.update({
                                $set: {password: saltedNewPassword}
                            }, function (err, raw) {
                                if (err) return next(err);
                                res.set('Content-Type', 'application/json');
                                res.status(200).end(JSON.stringify({
                                        successMessage: 'password successfully modified',
                                        successCode: 'PWD_UPDATED'
                                    } || {}, null, 2));
                            });
                        });
                    }
                    else {
                        res.set('Content-Type', 'application/json');
                        res.status(401).end(JSON.stringify({
                            errorMessage: 'New passwords aren\'t the same',
                            errorCode: 'E_NEW_PWD_NOT_EQUAL'
                        }, null, 2));
                    }
                }
                else {//no match
                    res.set('Content-Type', 'application/json');
                    res.status(401).end(JSON.stringify({
                        errorMessage: 'Bad old password',
                        errorCode: 'E_BAD_OLD_PWD'
                    }, null, 2));
                }
            });
        });
}

// Path : PUT api/users/{userId}/deleteUser
function deleteUser(req, res, next) {
    logger.info('Deactivating for user with id:\n ' + req.swagger.params.userId.value);
    User.findOneAndUpdate(
        {_id: req.swagger.params.userId.value},
        {
            $set: {
                active: false
            }
        },
        {new: true}, //means we want the DB to return the updated document instead of the old one
        function (err, updatedUser) {
            if (err) {
                return next(err);
            }
            else {
                logger.debug("Deactivated game object: \n" + updatedUser);
                res.set('Content-Type', 'application/json');
                res.status(200).end(JSON.stringify(updatedUser || {}, null, 2));
            }
        });
}