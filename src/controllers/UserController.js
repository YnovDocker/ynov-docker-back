/**
 * Created by Antoine on 08/04/2017.
 */
/* jshint node: true */
/*jshint esversion: 6 */

'use strict';

module.exports = {
		register: register,
		verifyEmail: verifyEmail
};

function register(req, res) {
		// variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
		let username = req.swagger.params.userToAdd1;
		console.log("name: " + JSON.stringify(username));
		// this sends back a JSON response which is a single string
		res.set('Content-Type', 'application/json');
		res.status(204).end(JSON.stringify({status: 204, message: "user registered !"} || {}));
}

function verifyEmail(req, res) {
		// variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
		// let username = req.swagger.params.userToAdd1;
		// console.log("name: " + JSON.stringify(username));
		// this sends back a JSON response which is a single string
		res.set('Content-Type', 'application/json');
		res.status(501).end(JSON.stringify({status: 501, message: "Not implemented yet"} || {}));
}