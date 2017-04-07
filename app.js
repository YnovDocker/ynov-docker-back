'use strict';
//library
const SwaggerExpress = require('swagger-express-mw'),
    swaggerTools = require('swagger-tools'),
    path = require('path'),
    yaml = require('js-yaml'),
    fs = require('fs'),
    jsonfile = require('jsonfile');

//config variable
const swaggerSpecFilePath = __dirname + '/api/swagger.json';
const port = process.env.PORT || 10010;

//app
let app = require('express')();


try {
    const config = yaml.safeLoad(fs.readFileSync(__dirname + '/api/swagger.yaml', 'utf8'));
    const indentedJson = JSON.stringify(config, null, 4);
    //console.log(indentedJson);
    fs.writeFile(swaggerSpecFilePath, indentedJson, function (err) {
        if (err) throw err;
        console.log('swagger.json write for /docs');

        //initialize swagger.json
        let swaggerDoc = require(swaggerSpecFilePath);
        swaggerDoc.host = 'localhost' + ':' + process.env.PORT || 10010;


        module.exports = app; // for testing

        const config = {
            appRoot: __dirname, // required config
            // swaggerFile: 'api/swagger.yaml',
            // controllersDir: 'src/controllers',
            // mockControllersDir: 'src/mocks',
            // helpers: 'src/helpers',
            controllers: __dirname + '/src/controllers',
            useStubs: process.env.NODE_ENV === 'development' // Conditionally turn on stubs (mock mode)
        };

        // Initialize the Swagger middleware
        swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {
            // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
            app.use(middleware.swaggerMetadata());

            // Validate Swagger requests
            app.use(middleware.swaggerValidator());

            // Route validated requests to appropriate controller
            app.use(middleware.swaggerRouter(config));

            // Serve the Swagger documents and Swagger UI
            app.use(middleware.swaggerUi());

            // Start the server
            SwaggerExpress.create(config, function (err, swaggerExpress) {
                if (err) {
                    throw err;
                }

                // install middleware
                swaggerExpress.register(app);

                app.listen(port);
                console.log('Your server is listening on port %d (http://localhost:%d)', port, port);
            });
        });
    });
} catch (e) {
    console.log(e);
}


