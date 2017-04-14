/**
 * Created by Antoine on 08/04/2017.
 */
//import authobject from mock
let authMock = require('../mocks/AuthMock');
let expect = require('chai').expect;
let request = require('request');

describe('Security', function () {
    describe('Authentication', function () {
        /*call auth endpoint with good creds and assert res is equal*/
        it('should login properly', function () {
            request.post('http://127.0.0.1:10010/api/auth/', {
                form: {
                    username: authMock.AuthObject.username,
                    password: authMock.AuthObject.password
                }
            }, function (err, httpResponse, body) {
                if (err) {
                    console.log(err);
                }
                console.log('httpRes:' + JSON.stringify(httpResponse));
                console.log('res:' + body);
                expect(httpResponse.statusCode).to.equal(200);
            });
        });
        /*call auth endpoint with bad credentials*/
        it('should fail login', function () {
            request.post('http://127.0.0.1:10010/api/auth/', {
                form: {
                    username: authMock.AuthObjectBadPw.username,
                    password: authMock.AuthObjectBadPw.password
                }
            }, function (err, httpResponse, body) {
                if (err) {
                    console.log(err);
                }
                console.log('httpRes:' + JSON.stringify(httpResponse));
                console.log('res:' + body);
                expect(httpResponse.statusCode).to.not.equal(200);
            });
        });
        /*call auth endpoint with bad formulated auth object*/
        it('should fail login', function () {
            request.post('http://127.0.0.1:10010/api/auth/', {
                form: {
                    username: authMock.AuthObjectEmpty.username,
                    password: authMock.AuthObjectEmpty.password
                }
            }, function (err, httpResponse, body) {
                if (err) {
                    console.log(err);
                }
                console.log('httpRes:' + JSON.stringify(httpResponse));
                console.log('res:' + body);
                expect(httpResponse.statusCode).to.not.equal(200);
            });
        });
    });
});



