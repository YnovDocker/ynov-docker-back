/**
 * Created by tdoret on 24/03/2017.
 */
'use strict';

let util = require('util');

module.exports = {
    addUser: addUser
};

function addUser(req, res) {
    // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
    //let name = req.swagger.params.name.value;
    // this sends back a JSON response which is a single string
    res.set('Content-Type', 'application/json');
    res.status(200).end(JSON.stringify({status: 200, message: "user created !"} || {}));
}