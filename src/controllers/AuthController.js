/**
 * Created by Antoine on 08/04/2017.
 */
/* jshint node: true */
/*jshint esversion: 6 */

'use strict';

module.exports = {
		auth: auth
};

function auth(req, res) {
		// variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
		// let name = req.swagger.params.userToAdd1.value;
		// this sends back a JSON response which is a single string
		res.set('Content-Type', 'application/json');
		res.status(200).end(JSON.stringify({status: 200, message: "user authenticated !"} || {}));
}