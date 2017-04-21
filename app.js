/* jshint node: true */
/*jshint esversion: 6 */
'use strict';
//library
const swaggerExpress = require('swagger-express-mw'),
		swaggerTools = require('swagger-tools'),
		path = require('path'),
		cors = require('cors'),
		yaml = require('js-yaml'),
		fs = require('fs'),
		jsonfile = require('jsonfile'),
		config = require('config'),
		log4js = require('log4js'),
		mongoose = require('mongoose'),
		multer = require('multer');


mongoose.Promise = Promise;

let logger = log4js.getLogger('server.core'),
		token = require('./src/helpers/token');

//config variable
const swaggerSpecFilePath = __dirname + '/api/swagger.json';
const port = process.env.PORT || 10010;

function allowCORS(req, res, next) {
		res.set("Access-Control-Allow-Origin", "*");
		res.set("Access-Control-Allow-Credentials", true);
		res.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, token");
		res.set("Access-Control-Expose-Headers", "Content-Type, token");
		res.set("Access-Control-Allow-Methods", "GET, POST, PUT, HEAD, DELETE, OPTIONS");
		next();
}

//app
let app = require('express')();

logger.info('/*************** *************** ***************/');
logger.info('/*************** STARTING SERVER ***************/');
logger.info('/*************** *************** ***************/');

try {
		const configFile = yaml.safeLoad(fs.readFileSync(__dirname + '/api/swagger.yaml', 'utf8'));
		const indentedJson = JSON.stringify(configFile, null, 4);
		//console.log(indentedJson);
		fs.writeFile(swaggerSpecFilePath, indentedJson, function (err) {
				if (err) {
						throw err;
				}
				logger.info('swagger.json write for /docs');

				//initialize swagger.json
				let swaggerDoc = require(swaggerSpecFilePath);
				swaggerDoc.host = config.server.host + ':' + port;

				//using CORS
				logger.info('Using CORS');
				app.options('*', cors());

				module.exports = app; // for testing

				const swaggerConfig = {
						appRoot: __dirname, // required config
						swaggerFile: __dirname + config.AppPaths.swaggerFile,
						controllersDir: __dirname + config.AppPaths.controllersDir,
						mockControllersDir: __dirname + config.AppPaths.mockControllersDir,
						helpers: __dirname + config.AppPaths.helpers,
						controllers: __dirname + config.AppPaths.controllers,
						useStubs: process.env.NODE_ENV === 'development' // Conditionally turn on stubs (mock mode)
				};

				// Initialize the Swagger middleware
				swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {

						app.use(log4js.connectLogger(log4js.getLogger('server.http'), {level: log4js.levels.INFO}));

						app.use(allowCORS);

						//connect to the mongo DB
						const mongoUrl = config.server.mongo.connectionString;
						const mongoOpts = config.server.mongo.options;

						let isConnectedBefore = false;
						let connectWithRetry = function () {
								return mongoose.connect(mongoUrl, mongoOpts, function (err) {
										if (err) {
												logger.error('Failed to connect to mongo on startup - retrying in 5 sec', err);
												setTimeout(connectWithRetry, 5000);
										}
								});
						};

						connectWithRetry();

						mongoose.connection.on('error', function () {
								logger.error('Could not connect to MongoDB');
						});

						mongoose.connection.on('disconnected', function () {
								logger.warn('Lost MongoDB connection...');
								if (!isConnectedBefore) {
										connectWithRetry();
								}
						});

						mongoose.connection.on('connected', function () {
								isConnectedBefore = true;
								logger.info('Connection established to MongoDB');
								logger.info('/*************** SERVER STARTED ***************/');
						});

						mongoose.connection.on('reconnected', function () {
								logger.info('Reconnected to MongoDB');
						});

						// Close the Mongoose connection, when receiving SIGINT
						process.on('SIGINT', function () {
								logger.warn('Process received SIGINT signal - going to exit ...');
								mongoose.connection.close(function () {
										logger.warn('Force to close the MongoDB connection');
										process.exit(0);
								});
						});

						logger.info('Using token handler middleware');
						//token.initialize();
						//app.use(token.tokenHandler);

						// Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
						app.use(middleware.swaggerMetadata());

						// Validate Swagger requests
						app.use(middleware.swaggerValidator());

						// Route validated requests to appropriate controller
						app.use(middleware.swaggerRouter(swaggerConfig));

						// Serve the Swagger documents and Swagger UI
						app.use(middleware.swaggerUi());

						// Start the server
						swaggerExpress.create(swaggerConfig, function (err, swaggerExpress) {
								if (err) {
										throw err;
								}

								// install middleware
								swaggerExpress.register(app);

								app.listen(port);
								logger.info('Your server is listening on port %d (http://%s:%d)', port, config.server.host, port);
						});
				});
		});
} catch (e) {
		console.log(e);
}


