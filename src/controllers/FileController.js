/**
 * Created by tdoret on 14/04/2017.
 */
'use strict';
let util = require('util'),
    mongoose = require('mongoose'),
    logger = require('log4js').getLogger('controller.file'),
    config= require('config'),
    _ = require('lodash'),
    sanitizer = require('sanitizer'),
    FileDB = require('../models/File'),
    File = mongoose.model('File'),
    multer = require('multer');

const DIR = config.fileRepository.privatePath;
let upload = multer({dest: DIR}).single();


module.exports = {
    addFile: addFile,
    getFile: getFile
};

function addFile(req,res,next) {
    // setHeadersFile(res, function(res) {
        upload(req, res, function (err) {
            if (err) {
                return res.end(err.toString());
            }
            res.set('Content-Type', 'application/json');
            res.status(200).end(JSON.stringify({
                    successMessage: 'File is uploaded',
                    successCode: 'OK'
                } || {}, null, 2));
        });
    // });




    //let userId = req.swagger.params.userId.value;
    //let fileNameToUpload = req.swagger.params.fileToAdd.value.fileName;
    // let fileSize;
    // let fileExt;



    //logger.debug('filename: '+ fileNameToUpload);
    //logger.debug('fileType: '+ req.swagger.params.fileToAdd.value.fileType);



    /*let file = new File({
        filename : fileNameToUpload,
        filesize: fileSize,
        fileExt: fileExt,
        fileType: req.swagger.params.fileToAdd.value.fileType,
        publicLink: config.fileRepository.publicPath + '/' + userId + '/' + fileNameToUpload,
        privateLink: config.fileRepository.privatePath + '/' + userId + '/' + fileNameToUpload
    })*/

}

function getFile(req, res, next) {

    // setHeadersFile(res,function(res) {
        res.set('Content-Type', 'application/json');
        res.status(200).end(JSON.stringify({
                successMessage: 'file catcher example',
                successCode: 'OK'
            } || {}, null, 2));
    // });
}

// function setHeadersFile(res, next) {
//     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
//     res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
//     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
//     res.setHeader('Access-Control-Allow-Credentials', true);
//
//     next(res);
// }

function setMulterDest() {
    multer({
        dest: DIR,
        rename: function (fieldname, filename) {
            return filename + Date.now();
        },
        onFileUploadStart: function (file) {
            console.log(file.originalname + ' is starting ...');
        },
        onFileUploadComplete: function (file) {
            console.log(file.fieldname + ' uploaded to  ' + file.path);
        }
    });
}