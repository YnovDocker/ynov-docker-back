/**
 * Created by tdoret on 14/04/2017.
 */
let mongoose = require('mongoose'),
    bcrypt = require('bcryptjs'),
    Schema = mongoose.Schema,
    logger = require('log4js').getLogger('Files'),
    _ = require('lodash'),
    sanitizer = require('sanitizer');

let File = new Schema({
    //declaration
    fileName: {type: String, required: true},
    fileSize: {type: Number, required: true},
    fileExt: {type: String, required: true},
    fileType: {type: String, required: true},
    userId: { type: String, required: true},
    //link to access in the file repository
    privateLink: {type: String, required: true},
    publicLink: {type: String, required: true},
    //controle attribute
    active: {type: Boolean, required: true, default: true},
    created_at: {type: Date, required: true, default: new Date()},
    updated_at: {type: Date, required: true, default: new Date()},
});

File.pre('save', function (next) {
    let file = this;

    //mis à jour élément de controle (Created_at, Updated_at)
    file.updated_at = Date.now;

    if (!file.created_at) {
        file.created_at = Date.now;
    }
    return next();
});

File.pre('update', function (next) {
    this.update({}, {$set: {updated_at: new Date()}});
    return next();
});

File.pre('findOneAndUpdate', function (next) {
    this.update({}, {$set: {updated_at: new Date()}});
    return next();
});

exports.File = mongoose.model('File', File);