/**
 * Created by Antoine on 02/03/2016.
 */
let crypto = require('crypto');
let logger = require('log4js').getLogger('service.security.crypt');

let algorithm = 'aes-256-ctr';
let password = '9595csapoRMLqwcscuUYHEBCJQ';

let format = 'utf8';
let hex = 'hex';

module.exports.encrypt = function encrypt(text) {
    let cipher = crypto.createCipher(algorithm, password);
    let crypted = cipher.update(text, format, hex);
    crypted += cipher.final(hex);
    return crypted;
};

module.exports.decrypt = function decrypt(text) {
    let decipher = crypto.createDecipher(algorithm, password);
    let dec = decipher.update(text, hex, format);
    dec += decipher.final(format);
    logger.debug('Deciphered: ' + dec);
    return dec;
};