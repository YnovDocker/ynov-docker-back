/**
 * Created by tdoret on 14/04/2017.
 */
/* jshint node: true */
/*jshint esversion: 6 */

'use strict';

let util = require('util'),
    mongoose = require('mongoose'),
    logger = require('log4js').getLogger('controller.file'),
    config = require('config'),
    _ = require('lodash'),
    sanitizer = require('sanitizer'),
    FileDB = require('../models/File'),
    File = mongoose.model('File'),
    fs = require('fs'),
    path = require('path'),
    upload_file = require('multer');

const DIR = config.fileRepository.privatePath;
const supported_mimes = [
    'image/png',
    'image/jpeg',
    'image/gif'
];

module.exports = {
    optionFile: optionFile,
    getFile: getFile,
    upload: upload
};

upload_file({ dest: './ressources/images'}).any();

function upload(req, res, next) {
    let file = req.swagger.params.file.value;
    logger.info('upload file ... ');

    if (supported_mimes.indexOf(file.mimetype) === -1) {
        logger.debug('File not supported for upload');
        res.set('Content-Type', 'application/json');
        res.status(401).end(JSON.stringify({
            errorMessage: 'File type not supported for uploads',
            errorCode: 'E_FILE_NOT_SUPPORTED'
        }, null, 2));
    }

    let userId = req.swagger.params.userId.value;
    let fileName = file.originalname.substr(0, file.originalname.lastIndexOf('.'));

    let fileToUpload = new File({
        fileName : fileName,
        fileSize: file.size,
        fileExt: file.originalname.substr(file.originalname.lastIndexOf('.')+1),
        fileType: 'IMAGE',
        userId: userId,
        publicLink: config.fileRepository.publicPath + userId + '/' + file.originalname,
        privateLink: config.fileRepository.privatePath + userId + '/' + file.originalname
    });

    logger.debug('File: '+ fileToUpload);

    fileToUpload.save(function (err, fileCreated) {
        if (err) {
            logger.error("got an error while creating file: ", err);
            return next(err);
        }

        if (_.isNull(fileCreated) || _.isEmpty(fileCreated)) {
            res.set('Content-Type', 'application/json');
            res.status(404).json({error: 'Error while creating file in mongo'} || {}, null, 2);
        }
        else {
            logger.info('File Save in mongoDB, need to save the buffer now ...');

            let path = config.fileRepository.privatePath + userId + '/';
            // let dirname = path.dirname(path);
            // logger.debug(dirname);
            if (!fs.existsSync(path)) {
                logger.info('directory not exist, need to create it ...');
                fs.mkdirSync(path);
            }

            fs.writeFile( path + file.originalname, file.buffer , function (err) {
                if (err) {
                    logger.error(err);

                    res.set('Content-Type', 'application/json');
                    res.status(401).end(JSON.stringify({
                        errorMessage: 'File not uploaded',
                        errorCode: 'E_FILE_NOT_UPLOADED'
                    }, null, 2));
                }
                else {
                    logger.info('file Upload in directory ...');
                    res.set('Content-Type', 'application/json');
                    res.status(200).end(JSON.stringify(fileToUpload)|| {}, null, 2);
                }


            });
        }
    });
}

// return status 200 for the pre flight
function optionFile(req, res) {
    logger.debug('pre flight: ' + req.method);
    res.set('Content-Type', 'application/json');
    res.status(200).end(JSON.stringify({
            successMessage: 'Pre flight request',
            successCode: 'OK'
        } || {}, null, 2));
}

function getFile(req, res) {
    logger.debug('test');
    res.set('Content-Type', 'application/json');
    res.status(200).end(JSON.stringify({
            successMessage: 'file catcher example',
            successCode: 'OK'
        } || {}, null, 2));
}