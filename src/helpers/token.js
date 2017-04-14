/**
 * Created by Antoine on 02/03/2016.
 */

var log4js = require('log4js'),
    logger = log4js.getLogger('service.security.token'),
    config = require('config'),
    moment = require('moment'),
    crypt = require('./crypt'),
    express = require('express'),
    mongoose = require('mongoose'),
    UserDB = require('../models/User'),
    User = mongoose.model('User');

var TOKEN_HEADER_NAME = 'x-access-token';

function Token(options) {
    this.userId = options.userId;
    this.expirationDate = options.expirationDate;
    this.username = options.username;
    this.firstname = options.firstname;
    this.lastname = options.lastname;
}

var tokenDuration;

module.exports.initialize = function initialize() {
    var configTokenDuration = config.server.auth.tokenDuration;
    var isConfigValid = !!configTokenDuration;

    if (isConfigValid) {
        try {
            tokenDuration = moment.duration(configTokenDuration.value, configTokenDuration.unit);
            isConfigValid = tokenDuration.asMilliseconds() !== 0;
        } catch (e) {
            isConfigValid = false;
        }
    }

    if (!isConfigValid) {
        logger.warn('Invalid token duration configuration: ' + configTokenDuration);
        tokenDuration = moment.duration(2, 'h');
    }

    logger.info('Token duration set to: ' + tokenDuration.humanize());
};

module.exports.createBasicToken = function createBasicToken(userId, username, firstname, lastname) {
    logger.info('Creating new token with basic information');
    var tkn = {
        userId: userId,
        expirationDate: '',
        username: username,
        firstname: firstname,
        lastname: lastname
    };

    var token = new Token(tkn);
    logger.info('Created token: ' + JSON.stringify(token));
    renewToken(token);

    return token;
};

module.exports.tokenHandler = function tokenHandler(req, res, next) {
    logger.debug('Handling token');
    let publicPath = false;
    //check the publicPath
    for(let i = 0; i<config.publicPath.length; i ++)
    {
        //logger.debug(config.publicPath[i]);

        if(config.publicPath[i] === req.originalUrl)
        {
            publicPath = true;
        }
    }
    //exception for /docs of swagger
    if(req.originalUrl.lastIndexOf('/docs', 0) >= 0)
        publicPath = true;

    if (publicPath) {
        logger.debug('Authorized url w/o token');
        next();
    }
    else {
        exports.getToken(req, function (reqToken) {
            let tokenString = reqToken;

            //logger.debug('String token: ' + tokenString);
            //logger.debug('Original url: ' + req.originalUrl);

            if (!tokenString) {
                logger.debug('Missing token in request');
                res.status(401).json({err: 'Missing token'});
            }
            else {
                let decryptedTokenString = crypt.decrypt(tokenString);


                var token;
                try {
                    token = JSON.parse(decryptedTokenString);
                } catch (e) {
                    logger.warn('Failed to parse token', e);
                }

                if (!token) {
                    logger.warn('Failed to parse token');
                    res.status(401).json({err: 'Invalid token'});
                    return;
                }

                if (isTokenExpired(token)) {
                    logger.info('Token is expired');
                    res.status(401).json({err: 'Expired token'});
                    return;
                }

                logger.debug('Request token: ', token);

                if (!isTokenValid(token, res)) {
                    res.status(401).end();
                }

                renewToken(token);
                exports.setResponseToken(token, res, function (tokenCrypted) {
                    next();
                });
            }
        });
    }
};

function isTokenValid(token) {
    logger.debug('Checking token:' + JSON.stringify(token));
    logger.debug('type of token:' + typeof(token));

    //verify token
    return token.hasOwnProperty('userId', 'expirationDate', 'username', 'lastname', 'firstname');
}

function verifyToken(userId, tokenString, res, next) {
    User.findById(userId)
        .exec(function (err, user) {
            if(err) {
                logger.error(err);
                next();
            }
            else {
                if(user.connectionToken === tokenString)
                    return true;
                else
                    return false;
            }
        })
}

function isTokenExpired(token) {
    var expirationDate = moment(token.expirationDate);
    if (!expirationDate.isValid()) {
        logger.debug('Expiration date is invalid: ' + token.expirationDate);
        return true;
    }

    if (expirationDate.isBefore(moment())) {
        logger.debug('Token is expired');
        return true;
    }

    return false;
}

module.exports.setResponseToken = function setResponseToken(token, res, cb) {
    let tokenString = JSON.stringify(token);
    let tokenCrypted = crypt.encrypt(tokenString);

    //res.set(TOKEN_HEADER_NAME, tokenCrypted);
    cb(tokenCrypted);
};

function renewToken(token) {
    var newExpirationDate = moment().add(tokenDuration).toISOString();
    logger.debug('Setting new expiration date to: ' + newExpirationDate);
    token.expirationDate = newExpirationDate;
}

module.exports.getToken = function getToken(req, cb) {
    //on set le token soit dans la query soit dans les headers
    logger.info('get Token: '+ req.query.token || req.header('x-access-token'));
    cb(req.query.token || req.header('x-access-token'));
};