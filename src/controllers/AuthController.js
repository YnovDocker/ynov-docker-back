/**
 * Created by Antoine on 08/04/2017.
 */
/* jshint node: true */
/*jshint esversion: 6 */

'use strict';
let util = require('util'),
		mongoose = require('mongoose'),
		logger = require('log4js').getLogger('controller.auth'),
		_ = require('lodash'),
		token = require('../helpers/token'),
		UserDB = require('../models/User'),
		User = mongoose.model('User');

module.exports = {
		auth: auth
};

function auth(req, res, next) {
		logger.info('Authenticate user with login: ' + req.swagger.params.authObject.value.username);

		let username = req.swagger.params.authObject.value.username;
		let password = req.swagger.params.authObject.value.password;

		User.getAuthenticated(username, password,
				function (err, user, reason) {
						if (err) {
								logger.error(err);
								return next(err);
						}

						if (_.isNull(user) || _.isEmpty(user)) {
								res.set('Content-Type', 'application/json');
								res.status(401).json({
												error: {
														errorCode: 'E_INVALID_CREDENTIALS',
														errorMessage: 'Invalid username or password.'
												}
										} || {}, null, 2);
						}
						else {
								logger.info('Creating user token for: ', user.username);
								let tokenObject = token.createBasicToken(user._id, user.username, user.firstname, user.lastname);
								token.setResponseToken(tokenObject, res,
										function (tokenCrypted) {
												let authResponse = {
														userId: tokenObject.userId,
														username: tokenObject.username,
														firstname: tokenObject.firstname,
														lastname: tokenObject.lastname,
														expirationDate: tokenObject.expirationDate
												};
												logger.info('token: ' + JSON.stringify(tokenObject));
												//res.json(authResponse);
												// logger.info('authResponse object created: \n' + JSON.stringify(authResponse));
												// logger.info('user object created: \n' + user);
												User.findOneAndUpdate(
														{_id: authResponse.userId},
														{
																$set: {
																		connectionToken: tokenCrypted,
																}
														},
														{new: true}, //means we want the DB to return the updated document instead of the old one
														function (err, updatedUser) {
																if (err) {
																		return next(err);
																}
																else {
																		res.set('Content-Type', 'application/json');
																		res.status(200).end(JSON.stringify({
																						success: {
																								successCode: 'USER_AUTH',
																								successMessage: 'User authenticated',
																								tokenObject: authResponse,
																								token: tokenCrypted
																						}
																				} || {}, null, 2));
																}
														});
										});
						}
				});
}

